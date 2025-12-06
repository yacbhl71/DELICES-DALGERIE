# Script pour corriger les erreurs get_current_admin
# Remplace get_current_admin par get_current_user dans server.py

import re

with open('/app/backend/server.py', 'r') as f:
    content = f.read()

# Remplacer toutes les occurrences
content = content.replace('get_current_admin', 'get_current_user')

with open('/app/backend/server.py', 'w') as f:
    f.write(content)

print('✅ Corrections appliquées')
