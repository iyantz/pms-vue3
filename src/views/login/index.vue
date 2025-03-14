<template>
  <div class="login">
    <!-- 登录头部 -->
    <div class="login-header">
      <div class="flex-y-center">
        <el-switch
          v-model="isDark"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
          @change="toggleTheme"
        />
      </div>
    </div>

    <!-- 登录表单 -->
    <el-form ref="loginFormRef" class="login-form" :model="loginData" :rules="loginRules">
      <div class="form-title">
        <h2>{{ defaultSettings.title }}</h2>
      </div>

      <!-- 用户名 -->
      <el-form-item prop="username">
        <div class="input-wrapper">
          <el-icon class="mx-2">
            <User />
          </el-icon>
          <el-input
            ref="username"
            v-model="loginData.username"
            placeholder="用户名"
            name="username"
            size="large"
            class="h-[48px]"
          />
        </div>
      </el-form-item>

      <!-- 密码 -->
      <el-tooltip :visible="isCapslock" content="大写锁定已打开" placement="right">
        <el-form-item prop="password">
          <div class="input-wrapper">
            <el-icon class="mx-2">
              <Lock />
            </el-icon>
            <el-input
              v-model="loginData.password"
              placeholder="密码"
              type="password"
              name="password"
              size="large"
              class="h-[48px] pr-2"
              show-password
              @keyup="checkCapslock"
              @keyup.enter="handleLoginSubmit"
            />
          </div>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <el-form-item prop="captchaCode">
        <div class="input-wrapper">
          <svg-icon icon-class="captcha" class="mx-2" />
          <el-input
            v-model="loginData.captchaCode"
            auto-complete="off"
            size="large"
            class="flex-1"
            placeholder="验证码"
            @keyup.enter="handleLoginSubmit"
          />

          <el-image :src="captchaBase64" class="captcha-img" @click="getCaptcha" />
        </div>
      </el-form-item>

      <div class="flex-x-between w-full py-1">
        <el-checkbox>记住我</el-checkbox>

        <el-link type="primary" href="/forget-password">忘记密码</el-link>
      </div>

      <!-- 登录按钮 -->
      <el-button
        :loading="loading"
        type="primary"
        size="large"
        class="w-full"
        @click.prevent="handleLoginSubmit"
      >
        登录
      </el-button>
    </el-form>

    <!-- 登录底部 -->
    <div class="login-footer">
      <el-text size="small">
        Copyright © 2021 - 2024 youlai.tech All Rights Reserved.
        <el-link :underline="false" href="http://beian.miit.gov.cn/" target="_blank">
          皖ICP备20006496号-2
        </el-link>
      </el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocationQuery, useRoute } from "vue-router";

import AuthAPI, { type LoginData } from "@/api/auth";
import router from "@/router";

import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";

import { useSettingsStore, useUserStore, useDictStore } from "@/store";

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const dictStore = useDictStore();

const route = useRoute();
const loginFormRef = ref();

const isDark = ref(settingsStore.theme === ThemeEnum.DARK); // 是否暗黑模式
const loading = ref(false); // 按钮 loading 状态
const isCapslock = ref(false); // 是否大写锁定
const captchaBase64 = ref(); // 验证码图片Base64字符串

const loginData = ref<LoginData>({
  username: "admin",
  password: "123456",
  captchaKey: "",
  captchaCode: "",
});

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: "请输入用户名",
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: "请输入密码",
      },
      {
        min: 6,
        message: "密码长度不能小于6位",
        trigger: "blur",
      },
    ],
    captchaCode: [
      {
        required: true,
        trigger: "blur",
        message: "请输入验证码",
      },
    ],
  };
});

// 获取验证码
function getCaptcha() {
  AuthAPI.getCaptcha().then((data) => {
    loginData.value.captchaKey = data.captchaKey;
    captchaBase64.value = data.captchaBase64;
  });
}

// 登录
async function handleLoginSubmit() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(async () => {
          await userStore.getUserInfo();
          // 需要在路由跳转前加载字典数据，否则会出现字典数据未加载完成导致页面渲染异常
          await dictStore.loadDictionaries();
          // 跳转到登录前的页面
          const { path, queryParams } = parseRedirect();
          router.push({ path: path, query: queryParams });
        })
        .catch(() => {
          getCaptcha();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

/**
 * 解析 redirect 字符串 为 path 和  queryParams
 *
 * @returns { path: string, queryParams: Record<string, string> } 解析后的 path 和 queryParams
 */
function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query: LocationQuery = route.query;
  const redirect = (query.redirect as string) ?? "/";

  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return { path, queryParams };
}

// 主题切换
const toggleTheme = () => {
  const newTheme = settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  settingsStore.changeTheme(newTheme);
};

// 检查输入大小写
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

// 设置登录凭证
const setLoginCredentials = (username: string, password: string) => {
  loginData.value.username = username;
  loginData.value.password = password;
};

onMounted(() => {
  getCaptcha();
});
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: url("@/assets/images/login-bg.jpg") no-repeat center right;

  .login-header {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: right;
    width: 100%;
    padding: 15px;

    .logo {
      width: 26px;
      height: 26px;
    }

    .title {
      margin: auto 5px;
      font-size: 24px;
      font-weight: bold;
      color: #3b82f6;
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    width: 460px;
    padding: 40px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: var(--el-box-shadow-light);

    @media (width <= 460px) {
      width: 100%;
      padding: 0 20px;
    }

    .form-title {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0 20px;
      text-align: center;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .captcha-img {
      height: 48px;
      cursor: pointer;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    .third-party-login {
      display: flex;
      justify-content: center;
      width: 100%;
      color: var(--el-text-color-secondary);

      *:not(:first-child) {
        margin-left: 20px;
      }

      .icon {
        cursor: pointer;
      }
    }
  }

  .login-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
}

:deep(.el-form-item) {
  background: var(--el-input-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
}

:deep(.el-input) {
  .el-input__wrapper {
    padding: 0;
    background-color: transparent;
    box-shadow: none;

    &.is-focus,
    &:hover {
      box-shadow: none !important;
    }

    input:-webkit-autofill {
      /* 通过延时渲染背景色变相去除背景颜色 */
      transition: background-color 1000s ease-in-out 0s;
    }
  }
}

html.dark {
  .login {
    background: url("@/assets/images/login-bg-dark.jpg") no-repeat center right;

    .login-content {
      background: transparent;
      box-shadow: var(--el-box-shadow);
    }
  }
}
</style>
