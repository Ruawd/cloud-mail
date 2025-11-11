<template>
  <div id="login-box" :style=" background ? 'background: var(--el-bg-color)' : ''" v-loading="oauthLoading" element-loading-text="Signing in...">
    <div id="background-wrap" v-if="!settingStore.settings.background">
      <div class="x1 cloud"></div>
      <div class="x2 cloud"></div>
      <div class="x3 cloud"></div>
      <div class="x4 cloud"></div>
      <div class="x5 cloud"></div>
    </div>
    <div v-else :style="background"></div>
    <div class="form-wrapper">
      <div class="container" :style="{ background: loginGradient }">
        <span class="form-title">{{ settingStore.settings.title }}</span>
        <div v-show="show === 'login'">
          <el-input class="email-input" v-model="form.email"
                    type="text" :placeholder="t('usernameOnly')" autocomplete="off">
          </el-input>
          <el-input v-model="form.password" :placeholder="t('password')" type="password" autocomplete="off">
          </el-input>
          <el-button class="btn" type="primary" @click="submit" :loading="loginLoading"
          >{{ t('loginBtn') }}
          </el-button>
          <el-button class="btn linux-btn" v-if="showLinuxDoBtn"  @click="linuxDoLogin">
            <span class="linuxdo-avatar">
              <el-avatar src="/image/linuxdo.webp" :size="18" />
            </span>
            <span class="linuxdo-label">LinuxDo</span>
            <span class="linuxdo-placeholder"></span>
          </el-button>
        </div>
        <div v-show="show !== 'login'">
          <el-input class="email-input" v-model="registerForm.email" type="text" :placeholder="t('usernameOnly')"
                    autocomplete="off">
          </el-input>
          <el-input v-model="registerForm.password" :placeholder="t('password')" type="password" autocomplete="off"/>
          <el-input v-model="registerForm.confirmPassword" :placeholder="t('confirmPwd')" type="password"
                    autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 0" v-model="registerForm.code" :placeholder="t('regKey')"
                    type="text" autocomplete="off"/>
          <el-input v-if="settingStore.settings.regKey === 2" v-model="registerForm.code"
                    :placeholder="t('regKeyOptional')" type="text" autocomplete="off"/>
          <div v-show="verifyShow"
               class="register-turnstile"
               :data-sitekey="settingStore.settings.siteKey"
               data-callback="onTurnstileSuccess"
               data-error-callback="onTurnstileError"
               data-after-interactive-callback="loadAfter"
               data-before-interactive-callback="loadBefore"
          >
            <span style="font-size: 12px;color: #F56C6C" v-if="botJsError">{{ t('verifyModuleFailed') }}</span>
          </div>
          <el-button class="btn" style="margin: 0" type="primary" @click="submitRegister" :loading="registerLoading"
          >{{ t('regBtn') }}
          </el-button>
          <el-button v-if="showLinuxDoBtn" class="btn linux-btn"  @click="linuxDoLogin">
            <span class="linuxdo-avatar">
              <el-avatar src="/image/linuxdo.webp" :size="18" />
            </span>
            <span class="linuxdo-label">LinuxDo</span>
            <span class="linuxdo-placeholder"></span>
          </el-button>
        </div>
        <template v-if="settingStore.settings.register === 0">
          <div class="switch" @click="show = 'register'" v-if="show === 'login'">{{ t('noAccount') }}
            <span>{{ t('regSwitch') }}</span></div>
          <div class="switch" @click="show = 'login'" v-else>{{ t('hasAccount') }} <span>{{ t('loginSwitch') }}</span>
          </div>
        </template>
      </div>
    </div>
    <el-dialog class="bind-dialog" v-model="showBindForm"  :title="t('bindTitle')" >
      <div class="bind-container">
        <el-input v-model="bindForm.email" type="text" :placeholder="t('usernameOnly')" autocomplete="off">
        </el-input>
        <el-input v-if="settingStore.settings.regKey === 0" v-model="bindForm.code" :placeholder="t('regKey')"
                  type="text" autocomplete="off"/>
        <el-input v-if="settingStore.settings.regKey === 2" v-model="bindForm.code"
                  :placeholder="t('regKeyOptional')" type="text" autocomplete="off"/>
        <el-button class="btn" type="primary" @click="bind" :loading="bindLoading"
        >{{ t('bindBtn') }}
        </el-button>
      </div>
    </el-dialog>
    <a class="github" href="https://github.com/maillab/cloud-mail">
      <Icon icon="mingcute:github-line" color="#1890ff" width="20" height="20" />
    </a>
  </div>
</template>

<script setup>
import router from "@/router";
import {computed, nextTick, reactive, ref, watch} from "vue";
import {login} from "@/request/login.js";
import {register} from "@/request/login.js";
import {isEmail} from "@/utils/verify-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {useUserStore} from "@/store/user.js";
import {useUiStore} from "@/store/ui.js";
import {Icon} from "@iconify/vue";
import {cvtR2Url} from "@/utils/convert.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import {useI18n} from "vue-i18n";
import {oauthBindUser, oauthLinuxDoLogin} from "@/request/ouath.js";

const messages = {
  en: {
    loginTitle: 'Sign in to your account',
    regTitle: 'Create a new account',
    usernameOnly: 'Username only',
    password: 'Password',
    loginBtn: 'Sign in',
    regBtn: 'Sign up',
    bindBtn: 'Bind & Sign in',
    bindTitle: 'Bind Email Account',
    confirmPwd: 'Confirm password',
    regKey: 'Invite code',
    regKeyOptional: 'Invite code (optional)',
    verifyModuleFailed: 'Verification module failed',
    noAccount: 'Need an account?',
    regSwitch: 'Create one',
    hasAccount: 'Already registered?',
    loginSwitch: 'Sign in',
    select: 'Select domain',
    emptyEmailMsg: 'Username cannot be empty',
    notEmailMsg: 'Invalid email address',
    emptyPwdMsg: 'Password cannot be empty',
    pwdLengthMsg: 'Password must be at least 6 characters',
    confirmPwdFailMsg: 'The two passwords do not match',
    emptyRegKeyMsg: 'Invite code cannot be empty',
    regSuccessMsg: 'Sign up successful',
    botVerifyMsg: 'Please complete the verification',
    minEmailPrefix: 'Username must be at least {msg} characters',
    bindHint: 'Please create and bind an email address first'
  }
}
const {t} = useI18n({ inheritLocale: false, locale: 'en', messages });
const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const loginLoading = ref(false)
const bindLoading = ref(false)
const oauthLoading = ref(false);
const showBindForm = ref(false);
const show = ref('login')

const bindForm = reactive({
  email: '',
  oauthUserId: '',
  code: ''
})

const form = reactive({
  email: '',
  password: '',

});
const domainList = computed(() => settingStore.domainList || [])
const suffix = ref('')
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: null
})
const registerLoading = ref(false)
// Control LinuxDo button display (keeps original setting behavior)
const showLinuxDoBtn = computed(() => settingStore.settings?.linuxdoSwitch)
watch(domainList, (list) => {
  if (list.length) {
    if (!suffix.value || !list.includes(suffix.value)) {
      suffix.value = list[0]
    }
  } else {
    suffix.value = ''
  }
}, { immediate: true })
const verifyShow = ref(false)
let verifyToken = ''
let turnstileId = null
let botJsError = ref(false)
let verifyErrorCount = 0

window.onTurnstileSuccess = (token) => {
  verifyToken = token;
};

window.onTurnstileError = (e) => {
  if (verifyErrorCount >= 4) {
    return
  }
  verifyErrorCount++
  console.warn('Captcha verification failed to load', e)
  setTimeout(() => {
    nextTick(() => {
      if (!turnstileId) {
        turnstileId = window.turnstile.render('.register-turnstile')
      } else {
        window.turnstile.reset(turnstileId);
      }
    })
  }, 1500)
};

window.loadAfter = (e) => {
  console.log('loadAfter')
}

window.loadBefore = (e) => {
  console.log('loadBefore')
}

const loginOpacity = computed(() => {
  const opacity = settingStore.settings.loginOpacity
  return uiStore.dark ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`
})

const loginGradient = computed(() => `linear-gradient(180deg, ${loginOpacity.value}, ${loginOpacity.value})`)

const background = computed(() => {

  return settingStore.settings.background ? {
    position: 'absolute',
    inset: '0',
    'z-index': '0',
    'pointer-events': 'none',
    'background-image': `url(${cvtR2Url(settingStore.settings.background)})`,
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'background-position': 'center'
  } : ''
})

const normalizeUsername = (value) => {
  const raw = (value || '').trim()
  return raw.includes('@') ? raw.split('@')[0] : raw
}

const buildEmail = (value) => {
  const raw = (value || '').trim()
  if (raw.includes('@')) {
    return raw
  }
  const domain = suffix.value || domainList.value[0] || ''
  return domain ? `${raw}${domain}` : raw
}

function linuxDoLogin() {
  const clientId = settingStore.settings.linuxdoClientId
  const redirectUri = encodeURIComponent(settingStore.settings.linuxdoCallbackUrl)
  window.location.href =
      `https://connect.linux.do/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email`
}

linuxDoGetUser();

async function linuxDoGetUser() {

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (code) {

    oauthLoading.value = true
    oauthLinuxDoLogin(code).then(data => {

      bindForm.oauthUserId = data.userInfo.oauthUserId;

      if (!data.token) {
        showBindForm.value = true
        oauthLoading.value = false
        ElMessage({
          message: t('bindHint'),
          type: 'warning',
          duration: 4000,
          plain: true,
        })
        return;
      }

      saveToken(data.token);
    }).catch(() => {
      oauthLoading.value = false
    })
  }

  const cleanUrl = window.location.origin + window.location.pathname
  window.history.replaceState({}, '', cleanUrl)
}

function bind() {

  const username = normalizeUsername(bindForm.email)

  if (!username) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }


  if (username.length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  const email = buildEmail(username);


  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {

    if (!bindForm.code) {

      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }

  }

  const form = {email, oauthUserId: bindForm.oauthUserId, code: bindForm.code}

  bindLoading.value = true
  oauthBindUser(form).then(data => {
    saveToken(data.token)
  }).catch(() => {
    bindLoading.value = false
  })
}

const submit = () => {

  const username = normalizeUsername(form.email)

  if (!username) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  const email = buildEmail(username)

  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!form.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  loginLoading.value = true
  login(email, form.password).then(async data => {
    await saveToken(data.token)
  }).finally(() => {
    loginLoading.value = false
  })
}

async function saveToken(token) {
  localStorage.setItem('token', token)
  const user = await loginUserInfo();
  accountStore.currentAccountId = user.accountId;
  userStore.user = user;
  const routers = permsToRouter(user.permKeys);
  routers.forEach(routerData => {
    router.addRoute('layout', routerData);
  });
  await router.replace({name: 'school'})
  uiStore.showNotice()
  oauthLoading.value = false;
  bindLoading.value = false;
}


function submitRegister() {

  const username = normalizeUsername(registerForm.email)

  if (!username) {
    ElMessage({
      message: t('emptyEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (username.length < settingStore.settings.minEmailPrefix) {
    ElMessage({
      message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}),
      type: 'error',
      plain: true,
    })
    return
  }

  const email = buildEmail(username)

  if (!isEmail(email)) {
    ElMessage({
      message: t('notEmailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (!registerForm.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password.length < 6) {
    ElMessage({
      message: t('pwdLengthMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {

    ElMessage({
      message: t('confirmPwdFailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (settingStore.settings.regKey === 0) {
    if (!registerForm.code) {
      ElMessage({
        message: t('emptyRegKeyMsg'),
        type: 'error',
        plain: true,
      })
      return
    }
  }

  if (!verifyToken && (settingStore.settings.registerVerify === 0 || (settingStore.settings.registerVerify === 2 && settingStore.settings.regVerifyOpen))) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile.render('.register-turnstile')
          } catch (e) {
            botJsError.value = true
            console.log('captcha script failed to load')
          }
        } else {
          window.turnstile.reset('.register-turnstile')
        }
      })
    } else if (!botJsError.value) {
      ElMessage({
        message: t('botVerifyMsg'),
        type: "error",
        plain: true
      })
    }
    return;
  }

  registerLoading.value = true

  const form = {
    email,
    password: registerForm.password,
    token: verifyToken,
    code: registerForm.code
  }

  register(form).then(({regVerifyOpen}) => {
    show.value = 'login'
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.code = ''
    registerLoading.value = false
    verifyToken = ''
    settingStore.settings.regVerifyOpen = regVerifyOpen
    verifyShow.value = false
    ElMessage({
      message: t('regSuccessMsg'),
      type: 'success',
      plain: true,
    })
  }).catch(res => {

    registerLoading.value = false

    if (res.code === 400) {
      verifyToken = ''
      settingStore.settings.regVerifyOpen = true
      if (turnstileId) {
        window.turnstile.reset(turnstileId)
      } else {
        nextTick(() => {
          turnstileId = window.turnstile.render('.register-turnstile')
        })
      }
      verifyShow.value = true

    }
  });
}

</script>


<style>
.no-autofill-pwd {
  .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>

<style lang="scss" scoped>

.form-wrapper {
  position: absolute;
  inset: 0;
  padding: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 100vh;
}

.container {
  background: linear-gradient(180deg, rgba(255,255,255,.82), rgba(240,243,251,.9));
  padding: 44px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 480px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.55);
  box-shadow: 0 32px 80px rgba(15,23,42,.32);
  backdrop-filter: blur(28px);
  /* Remove Element Plus adjacent-button margin so second button aligns */
  :deep(.el-button + .el-button) {
    margin-left: 0 !important;
  }
  @media (max-width: 1024px) {
    padding: 32px 32px;
    max-width: 420px;
  }
  @media (max-width: 767px) {
    padding: 26px 22px;
    width: 100%;
    max-width: none;
    margin: 0 18px;
  }

  .btn {
    height: 48px;
    width: 100%;
    border-radius: 14px;
    font-weight: 600;
    font-size: 15px;
    background: linear-gradient(135deg, #1f55ff, #3f7bff);
    border: none;
    box-shadow: 0 12px 28px rgba(33,86,255,.35);
    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 32px rgba(33,86,255,.45);
      filter: brightness(1.03);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 10px 24px rgba(33,86,255,.3);
    }
  }

  .linux-btn {
    margin-top: 14px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1f55ff, #3f7bff);
    border: none;
    color: #fff;
    box-shadow: 0 12px 28px rgba(33,86,255,.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    font-weight: 600;
    /* Remove default Element Plus horizontal padding to ensure perfect centering */
    --el-button-padding-horizontal: 0px;
    padding-left: 0 !important;
    padding-right: 0 !important;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 32px rgba(33,86,255,.45);
      filter: brightness(1.03);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 10px 24px rgba(33,86,255,.3);
    }
  }

  :deep(.linux-btn .el-button__content) {
    width: 100%;
    padding: 0 !important;
    gap: 0 !important;
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    align-items: center;
    justify-items: center;
  }
  
  :deep(.linux-btn .linuxdo-avatar) {
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :deep(.linux-btn .el-avatar) {
    display: block;
  }
  :deep(.linux-btn .linuxdo-label) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  :deep(.linux-btn .linuxdo-placeholder) {
    width: 40px;
    height: 100%;
    display: block;
  }

  .form-title {
    font-weight: 700;
    font-size: 30px !important;
    color: #1f2937;
    margin-bottom: 28px;
  }

  .switch {
    margin-top: 26px;
    text-align: center;
    color: rgba(15,23,42,.7);

    span {
      color: #2154ef;
      cursor: pointer;
      font-weight: 600;
    }
  }

  :deep(.el-input__wrapper) {
    border-radius: 14px;
    background: rgba(255,255,255,.98);
    border: 1px solid rgba(15,23,42,.08);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.85), 0 12px 30px rgba(15,23,42,.08);
  }

  .el-input {
    height: 46px;
    width: 100%;
    margin-bottom: 18px;

    :deep(.el-input__inner) {
      height: 44px;
    }
  }
}

:deep(.bind-dialog) {
  width: 400px !important;
  @media (max-width: 440px) {
    width: calc(100% - 40px) !important;
    margin-right: 20px !important;
    margin-left: 20px !important;
  }
}

.bind-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.github {
  display: none;
}

:deep(.el-button+.el-button) {
  margin-top: 12px;
}

.register-turnstile {
  margin-bottom: 18px;
}

.custom-style {
  margin-bottom: 10px;
}

.custom-style .el-segmented {
  --el-border-radius-base: 6px;
  width: 180px;
}

#login-box {
  background: linear-gradient(to bottom, #2980b9, #6dd5fa, #fff);
  font: 100% Arial, sans-serif;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
}

#background-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
}

#background-wrap .cloud {
  position: absolute;
}

@keyframes animateCloud {
  0% {
    margin-left: -500px;
  }

  100% {
    margin-left: 100%;
  }
}

.x1 {
  animation: animateCloud 30s linear infinite;
  transform: scale(0.65);
}

.x2 {
  animation: animateCloud 15s linear infinite;
  transform: scale(0.3);
}

.x3 {
  animation: animateCloud 25s linear infinite;
  transform: scale(0.5);
}

.x4 {
  animation: animateCloud 13s linear infinite;
  transform: scale(0.4);
}

.x5 {
  animation: animateCloud 20s linear infinite;
  transform: scale(0.55);
}

.cloud {
  background: linear-gradient(to bottom, #fff 5%, #f1f1f1 100%);
  border-radius: 100px;
  box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
  height: 120px;
  width: 350px;
  position: relative;
}

.cloud:after,
.cloud:before {
  content: "";
  position: absolute;
  background: #fff;
  z-index: -1;
}

.cloud:after {
  border-radius: 100px;
  height: 100px;
  left: 50px;
  top: -50px;
  width: 100px;
}

.cloud:before {
  border-radius: 200px;
  height: 180px;
  width: 180px;
  right: 50px;
  top: -90px;
}

</style>
