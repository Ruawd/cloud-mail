import app from '../hono/hono';
import initService from '../init/init';

// 支持路径参数方式: /init/:secret
app.get('/init/:secret', (c) => {
	return initService.init(c);
})

// 支持查询参数方式: /init?secret=xxx
app.get('/init', (c) => {
	return initService.init(c);
})
