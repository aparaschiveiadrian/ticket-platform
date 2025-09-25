# Keycloak Setup

## Quick Setup

1. **Start infrastructure**: `docker-compose up -d`
2. **Import Keycloak configuration**: 
   ```bash
   docker cp keycloak-sync-import.json ticket-platform-keycloak-1:/tmp/import.json
   docker exec ticket-platform-keycloak-1 /opt/keycloak/bin/kc.sh import --file /tmp/import.json
   ```
3. **Run application**: `mvn spring-boot:run`

## What's Created

- **Realm**: `event-ticket-platform`
- **Client**: `event-ticket-platform-app`
- **Client Secret**: `gJCNV7hMkw2ZK9FyARIKTcalWDFacA1g`
- **50 Users**:
  - 10 organizers (organizer1-organizer10) - ROLE_ORGANIZER
  - 10 staff (staff1-staff10) - ROLE_STAFF
  - 30 attendees (attendee1-attendee30) - ROLE_ATTENDEE
- **All users have password**: `password`
- **UUIDs match exactly** with `V9__DML_Insert_Users.sql` migration

## Database Sync

The `keycloak-sync-import.json` file uses the exact same UUIDs as defined in `V9__DML_Insert_Users.sql`. This ensures that when users are provisioned by the `UserProvisioningFilter`, they will have consistent IDs across all environments.

## Test Token
```bash
curl -X POST http://localhost:9090/realms/event-ticket-platform/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=organizer1&password=password&grant_type=password&client_id=event-ticket-platform-app&client_secret=gJCNV7hMkw2ZK9FyARIKTcalWDFacA1g"
```
