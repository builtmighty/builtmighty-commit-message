import { window, extensions } from 'vscode';
import { GitExtension, Repository } from '../typings/git';
import { IQuickPickSettings } from '../typings/quickPick';
import { getMode } from './settings';

function getGitExtension() {
  const vscodeGit = extensions.getExtension<GitExtension>('vscode.git');
  const gitExtension = vscodeGit && vscodeGit.exports;
  return gitExtension;
}

export const getRepo = (repoUri: string): Repository | false => {
  const gitExtension = getGitExtension();
  if (!gitExtension?.enabled) {
    window.showErrorMessage(
      'Git extensions are not currently enabled, please try again after enabled!'
    );
    return false;
  }
  let repos: Repository[] = gitExtension.getAPI(1).repositories;
  const repo = repos.find(
    (e) => e.rootUri.toString() === repoUri
    // (e) => e._repository.repository.repositoryRoot === repoUri
  );
  return repo || repos[0];
};

export const setGitMessage = (repo: Repository, msg: string): void => {
  let mode: string | undefined = getMode();
  if (mode && mode === 'Concatenate') {
    repo.inputBox.value += repo.inputBox.value.length > 1 ? '\n' + msg : msg;
  } else {
    repo.inputBox.value = msg;
  }
};

export const getCurrentBranch = (repo: Repository): IQuickPickSettings[] => {
  const fullBranchName = repo.state.HEAD?.upstream?.name;
  const shortBranchName = fullBranchName ? fullBranchName.split('/').pop() : null;
  const jiraIssuePattern = /[A-Z]+-\d+/; // Pattern to match Jira issue ID
  const jiraIssueId = fullBranchName ? fullBranchName.match(jiraIssuePattern) : null;

  return [
    {
      label: jiraIssueId ? jiraIssueId[0] : shortBranchName || '',
      detail: jiraIssueId ? 'Jira Issue ID' : 'Branch Name',
    },
    // ... Other options if needed
  ];
};

