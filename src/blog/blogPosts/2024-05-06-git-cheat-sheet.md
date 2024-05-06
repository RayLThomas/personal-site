---
title: Git Cheat Sheet
date: 2023-09-12T19:05:36.701Z
tags:
  - Blog
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
6. git clone <url> - Clone a repository into a new directory.
7. 1. Usage: git clone https://github.com/user/repository.git
8. git pull: Fetch from and integrate with another repository or a local branch.
9. 1. Usage: git pull origin master
10. git branch - List, create, or delete branches.
11. 1. Usage: git branch (list branches), git branch new-branch (create a new branch), git branch -d branch-name (delete a branch)
12. git checkout - Switch branches or restore working tree files.
13. 1. Usage: git checkout branch-name, git checkout -b new-branch-name (create and switch to new branch)
14. git merge <branch>: Join two or more development histories together.
15. 1. Usage - git merge feature-branch
16. git reset: Reset current HEAD to the specified state.
17. 1. Usage - git reset --hard HEAD^ (move back to one commit)
18. git stash: Stash the changes in a dirty working directory.
19. 1. Usage - git stash, git stash apply
20. git diff: Show changes between commits, commit and working tree, etc.
21. 1. Usage - git diff, git diff --staged



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

18. Fetch Changes: Regularly fetch changes from the remote repository to keep your local copy up to date and minimize merge conflicts.
19. 1. Usage: git fetch origin
20. Reviewing Logs: Regularly review logs to keep track of changes made by team members and understand project history.
21. 1. Usage: git log --oneline --graph





How to ensure that your Dev branch is up to date with the main branch:

20. Switch to the dev branch:
21. 1. git checkout dev
22. Fetch the latest changes from your remote repository:
23. 1. git fetch origin
24. Merge changes from main into dev:
25. 1. git merge origin/main\
       This command merges the latest changes from main (assuming main is up to date) into your dev branch..
26. Push the updated dev branch back to the remote to ensure that others working on the project are also up to date:
27. 1. git push origin dev

<!--EndFragment-->