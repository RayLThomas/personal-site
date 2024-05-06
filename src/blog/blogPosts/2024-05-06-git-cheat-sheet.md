---
title: Git Cheat Sheet
date: 2023-09-12T19:05:36.701Z
tags:
  - Git
image: /images/git_cheat_sheet.jpg
imageAlt: AI generated image for the git cheetsheet post of a futuristic computer.
description: I've kept track of all my most commonly used git commands and a few
  very basic sequences. Here for a quick reference.
---
<!--StartFragment-->

# Common Git Commands:

1. git help - list of all git commands and what they do. In a pinch this is handy for a quick reminder.
2. git status - to determine what branch you’re on and if it is up to date with origin/your-branch
3. Basic sequence for local changes made:
4. 1. git add .\
      This command stages all your changes locally.
   2. git commit . -m ”your message here”\
      This records your staged changes to the local repository.
   3. git push origin <your-branch-name-here>\
      This command pushes the commits from your local branch to the remote repository. 
5. git log - views project history including dates, changes, and user.
6. git clone <url> - Clone a repository into a new directory.\
   Usage: git clone https://github.com/user/repository.git
7. git pull: Fetch from and integrate with another repository or a local branch.\
   Usage: git pull origin master
8. git branch - List, create, or delete branches.\
   Usage: git branch (list branches), git branch new-branch (create a new branch), git branch -d branch-name (delete a branch)
9. git checkout - Switch branches or restore working tree files.\
   Usage: git checkout branch-name, git checkout -b new-branch-name (create and switch to new branch)
10. git merge <branch>: Join two or more development histories together.\
    Usage - git merge feature-branch
11. git reset: Reset current HEAD to the specified state.\
    Usage - git reset --hard HEAD^ (move back to one commit)
12. git stash: Stash the changes in a dirty working directory.\
    Usage - git stash, git stash apply
13. git diff: Show changes between commits, commit and working tree, etc.\
    Usage - git diff, git diff --staged

# Tips for Managing Changes:

13. Inspecting Changes: Before committing, use git diff to inspect what changes are being made to ensure only intended updates are included.
14. Commit Best Practices: Keep commits small and focused on a single purpose for clarity and history tracking.
15. Branching Strategy: Utilize a branching strategy like Git Flow to manage features, fixes, and releases efficiently.

# Handling Conflicts:

16. Resolving Merge Conflicts: When encountering a merge conflict, use git status to identify conflicted files. Open these files and make the necessary changes. After resolving conflicts, add the resolved files with git add ., and then complete the merge by committing.
17. Using Git Mergetool: Set up and use a graphical merging tool to visually compare and resolve conflicts:
18. 1. Setup: git config --global merge.tool <toolname>
    2. Usage: git mergetool

# Collaborating:

18. Fetch Changes: Regularly fetch changes from the remote repository to keep your local copy up to date and minimize merge conflicts.\
    Usage: git fetch origin
19. Reviewing Logs: Regularly review logs to keep track of changes made by team members and understand project history.\
    Usage: git log --oneline --graph

How to ensure that your Dev branch is up to date with the main branch:

20. Switch to the dev branch:\
    git checkout dev
21. Fetch the latest changes from your remote repository:\
    git fetch origin
22. Merge changes from main into dev:\
    git merge origin/main\
    This command merges the latest changes from main (assuming main is up to date) into your dev branch..
23. Push the updated dev branch back to the remote to ensure that others working on the project are also up to date:\
    git push origin dev

<!--EndFragment-->