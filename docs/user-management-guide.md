# S.H.I.E.L.D User Management Guide

This guide explains how to manage users in the S.H.I.E.L.D (Safe Haven of Information & Enterprising Low Deterrency) application.

## Creating a Sudo User

Sudo users have full administrative privileges in the system. To create a sudo user, you can use the provided script:

1. Make sure you have Node.js installed
2. Navigate to the project root directory
3. Run the following command:

```bash
npm run create-sudo
```

4. Follow the prompts to enter:
   - Email address
   - Password
   - First name
   - Last name

The script will create a sudo user with enterprise subscription level.

## Accessing the Admin Dashboard

Once you have a sudo or admin user:

1. Log in to the application using your credentials
2. Navigate to `/admin` in your browser
3. You'll see the admin dashboard with three tabs:
   - Users
   - Reports
   - System Settings (sudo users only)

## User Management

### Viewing Users

The Users tab displays a table of all users in the system with the following information:
- ID
- Email
- Name
- Role
- Subscription
- Status

### Adding a New User

To add a new user (sudo users only):

1. Click the "Add User" button
2. Fill in the required information:
   - Email
   - Password
   - Confirm password
   - First name (optional)
   - Last name (optional)
   - Role (user, admin, or sudo)
   - Subscription tier (free, basic, premium, or enterprise)
3. Click "Create User"

### Editing a User

To edit an existing user:

1. Click the edit (pencil) icon next to the user
2. Modify any of the following:
   - Role
   - Subscription tier
   - Active status
3. Click "Save Changes"

### Deleting a User

To delete a user (sudo users only):

1. Click the delete (trash) icon next to the user
2. Confirm the deletion when prompted

## User Roles

The system has three user roles:

1. **User**: Regular users with access to the main application features
2. **Admin**: Administrators who can manage users and reports
3. **Sudo**: Super administrators with full access to all features, including system settings

## Subscription Tiers

The system has four subscription tiers:

1. **Free**: Basic access to the application
2. **Basic**: Additional features beyond the free tier
3. **Premium**: Advanced features and priority support
4. **Enterprise**: Full access to all features and dedicated support

## System Settings

Sudo users can access the System Settings tab to configure:

1. **General Settings**:
   - Site name
   - Contact email
   - Registration settings
   - Session timeout

2. **Security Settings**:
   - Password requirements
   - Two-factor authentication
   - Session limits

3. **Notification Settings**:
   - Email notifications
   - Admin alerts
   - Report summaries

## Best Practices

1. Create at least two sudo users to ensure you don't lose access
2. Use strong, unique passwords for admin and sudo accounts
3. Regularly review the user list to ensure only authorized users have access
4. Be cautious when deleting users, as this action cannot be undone