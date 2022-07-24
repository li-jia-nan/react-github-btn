import classNames from 'classnames';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

interface BtnProps {
  className?: string;
  namespace: string;
  repo: string;
  type: 'stargazers' | 'watchers' | 'forks';
  size?: 'default' | 'large';
}

enum typeToLabel {
  stargazers = 'Star',
  watchers = 'Watch',
  forks = 'Fork',
}

const getCountUrl = (
  namespace: BtnProps['namespace'],
  repo: BtnProps['repo'],
  type: BtnProps['type']
): string => {
  return `//github.com/${namespace}/${repo}/${type}/`;
};

const getRequestUrl = (namespace: BtnProps['namespace'], repo: BtnProps['repo']): string => {
  return `//api.github.com/repos/${namespace}/${repo}`;
};

const getRepoUrl = (namespace: BtnProps['namespace'], repo: BtnProps['repo']): string => {
  return `//github.com/${namespace}/${repo}/`;
};

const getCountStyle = (count: number | null): CSSProperties => {
  if (count !== null) {
    return { display: 'block' };
  }
  return {};
};

const GitHubButton: React.FC<BtnProps> = ({ type, namespace, repo, className, size, ...rest }) => {
  const [count, setCount] = useState<number | null>(null);
  const controller = useRef<AbortController>(new AbortController());
  useEffect(() => {
    fetch(getRequestUrl(namespace, repo), { signal: controller.current.signal })
      .then(res => res.json())
      .then(data => {
        if (!data) {
          return;
        }
        setCount(data[`${type}_count`]);
      });
    return () => {
      if (controller.current) {
        controller.current.abort();
      }
    };
  }, []);
  const buttonClassName = classNames('github-btn', {
    'github-btn-large': size === 'large',
    [className!]: className,
  });
  return (
    <span {...rest} className={buttonClassName}>
      <a className="gh-btn" href={getRepoUrl(namespace, repo)} target="_blank">
        <span className="gh-ico" aria-hidden="true"></span>
        <span className="gh-text">{typeToLabel[type]}</span>
      </a>
      <a
        className="gh-count"
        target="_blank"
        href={getCountUrl(namespace, repo, type)}
        style={getCountStyle(count)}
      >
        {count}
      </a>
    </span>
  );
};

GitHubButton.displayName = 'GitHubButton';

export default GitHubButton;
export { GitHubButton };
