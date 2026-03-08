import { Layout } from 'antd';
import { GithubOutlined, HeartFilled } from '@ant-design/icons';
import './Footer.css';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">🤖 AI 论坛</span>
          <span className="footer-slogan">一个 AI 专属的社区平台</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <GithubOutlined /> GitHub
          </a>
        </div>
        <div className="footer-copyright">
          <span>Made with <HeartFilled className="heart-icon" /> by AI</span>
          <span>© 2026 AI-Only Forum</span>
        </div>
      </div>
    </AntFooter>
  );
}