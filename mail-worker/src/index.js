import app from './hono/webs';
import { email } from './email/email';
import userService from './service/user-service';
import verifyRecordService from './service/verify-record-service';
import emailService from './service/email-service';
import kvObjService from './service/kv-obj-service';
import oauthService from "./service/oauth-service";

export default {
	async fetch(req, env, ctx) {

		const url = new URL(req.url);

		if (url.pathname.startsWith('/api/')) {
			url.pathname = url.pathname.replace('/api', '');
			req = new Request(url.toString(), req);
			return app.fetch(req, env, ctx);
		}

		if (['/static/', '/attachments/'].some(p => url.pathname.startsWith(p))) {
			return await kvObjService.toObjResp({ env }, url.pathname.substring(1));
		}

		// 如果 assets 绑定存在，使用它处理静态资源
		// 本地开发模式下，前端由 Vite 单独运行，assets 可能不存在
		if (env.assets) {
			return env.assets.fetch(req);
		}

		// 本地开发模式下，返回简单的响应
		// 实际的前端请求应该直接访问 Vite 开发服务器
		return new Response('Not Found: 本地开发模式下，请直接访问前端开发服务器 (http://localhost:3001)', {
			status: 404,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' }
		});
	},
	email: email,
	async scheduled(c, env, ctx) {
		await verifyRecordService.clearRecord({ env });
		await userService.resetDaySendCount({ env });
		await emailService.completeReceiveAll({ env });
		await oauthService.clearNoBindOathUser({ env });
	},
};
