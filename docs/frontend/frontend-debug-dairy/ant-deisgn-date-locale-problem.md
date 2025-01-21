---
title: Ant Design 日期组件显示中文问题
date: 2025-01-25
cover: /images/antd-date-en.png
---

使用 Ant Deisign 月份选择组件，设置了中文后还是显示了英语月份。

![月份选择组件显示英文](/images/antd-date-en.png)

对于日期组件，除了设置 Ant Design 自身`locale`属性为中文外，还需要设置 `dayjs` 的语言包，才能正常显示中文。

![月份选择组件显示中文](/images/antd-date-zhcn.png)

```JSX{7-10}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

dayjs.locale('zh-cn');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
```