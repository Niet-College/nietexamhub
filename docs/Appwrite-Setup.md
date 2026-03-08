# Appwrite & Backend Setup

We use Appwrite for handling new uploads securely.

1. **Storage Bucket**: The `ppt-uploads` bucket holds files.
2. **Database**: The `StudyMaterials` -> `uploads` collection stores document references so the frontend can query newly uploaded materials.
3. **Authentication**: Handled via Anonymous Sessions so any student can upload without an account.
