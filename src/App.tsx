import classNames from 'classnames';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

interface GitHubButtonProps {
  className?: string;
  type: 'stargazers' | 'watchers' | 'forks';
  namespace: string;
  repo: string;
  size?: string;
}

enum typeToLabel {
  stargazers = 'Star',
  watchers = 'Watch',
  forks = 'Fork',
}

const getCountUrl = (
  namespace: GitHubButtonProps['namespace'],
  repo: GitHubButtonProps['repo'],
  type: GitHubButtonProps['type']
): string => {
  return `//github.com/${namespace}/${repo}/${type}/`;
};

const getRequestUrl = (
  namespace: GitHubButtonProps['namespace'],
  repo: GitHubButtonProps['repo']
): string => {
  return `//api.github.com/repos/${namespace}/${repo}`;
};

const getRepoUrl = (
  namespace: GitHubButtonProps['namespace'],
  repo: GitHubButtonProps['repo']
): string => {
  return `//github.com/${namespace}/${repo}/`;
};

const getCountStyle = (count: number | null): CSSProperties => {
  if (count !== null) {
    return { display: 'block' };
  }
  return {};
};

const GitHubButton: React.FC<GitHubButtonProps> = ({ type, namespace, repo, className, size }) => {
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

  return (
    <span
      className={classNames('github-btn', {
        'github-btn-large': size === 'large',
        [className!]: className,
      })}
    >
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
