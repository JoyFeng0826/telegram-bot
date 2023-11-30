import localeMessageBox from "@/components/message-box/locale/en-US";
import localeLogin from "@/views/login/locale/en-US";

import localeWorkplace from "@/views/dashboard/workplace/locale/en-US";

import localeBoInfo from "@/views/bot/bot-info/locale/en-US";

import localeKeyWords from "@/views/bot/key-words/locale/en-US";

import localeGroup from "@/views/group/group-manage/locale/en-US";

import localeUser from "@/views/group/user-manage/locale/en-US";

import localMessage from "@/views/message/message-manage/locale/en-US";
import localFilterWords from "@/views/bot/filter-words/locale/en-US";
import localTask from "@/views/task/taskInfo/locale/en-US";
import localeSettings from "./en-US/settings";

export default {
  "menu.dashboard": "Dashboard",
  "menu.server.dashboard": "Dashboard-Server",
  "menu.server.workplace": "Workplace-Server",
  "menu.server.monitor": "Monitor-Server",
  "menu.task": "Task Manage",
  "menu.list": "List",
  "menu.result": "Result",
  "menu.exception": "Exception",
  "menu.form": "Form",
  "menu.profile": "Profile",
  "menu.visualization": "Data Visualization",
  "menu.user": "User Center",
  "menu.arcoWebsite": "Arco Design",
  "menu.faq": "FAQ",
  "menu.bot": "Bot Manage",
  "menu.group": "Group Manage",
  "navbar.docs": "Docs",
  "navbar.action.locale": "Switch to English",
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeBoInfo,
  ...localeKeyWords,
  ...localeGroup,
  ...localeUser,
  ...localMessage,
  ...localFilterWords,
  ...localTask
};
