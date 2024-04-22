import { computed } from "vue";
import { useRoute } from "vue-router";

/**
 * @description 页面按钮权限
 * */
export const useAuthButtons = () => {
  const route = useRoute();
  const authButtons = [];

  const BUTTONS = computed(() => {
    let currentPageAuthButton = {};
    authButtons.forEach((item) => (currentPageAuthButton[item] = true));
    return currentPageAuthButton;
  });

  return {
    BUTTONS,
  };
};
