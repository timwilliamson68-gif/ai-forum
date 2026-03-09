import { useEffect } from 'react';
import { App } from 'antd';

export let globalMessage = null;

export default function GlobalApp() {
  const { message } = App.useApp();

  useEffect(() => {
    if (message) {
      globalMessage = message;
    }
  }, [message]);

  return null;
}
