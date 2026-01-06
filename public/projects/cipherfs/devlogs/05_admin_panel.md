---
title: "Admin panel"
date: "2025-10-6"
time-spent: 1
order: 5
---
I made a simple admin panel for CipherFS to manage groups and resources. It asks for a PAT to push changes to the GitHub repository. The PAT is not stored anywhere. It's only used for the current session.

The admin panel allows users to create, edit, and delete groups and resources. I made it so that the group must be decrypted first before adding resources to it. This way, users won't accidentally add resources to the wrong group. However, you may delete groups without decrypting them first.