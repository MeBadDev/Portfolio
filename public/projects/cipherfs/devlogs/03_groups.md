---
title: "Implemented groups"
date: "2025-10-6"
time-spent: 1.5
order: 3
---
I spent some time implementing a nice 'mind-map' like view for CipherFS. User can create multiple groups each with their own keys. This way, I can share different groups with different people without worrying about them seeing things they shouldn't.

Each group can contain multiple resources (files or links). The web app fetches the encrypted data from the GitHub repository and decrypts only the group that the user has the key for. Even if someone scraped the repo, they won't be able to access the files without the key.

I need to improve the UI/UX for mobile devices, and that'll be my next step.