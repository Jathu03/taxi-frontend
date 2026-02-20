import { menuItems, type MenuItem } from "@/constants/menuItems";

export const getRolePermissions = (role: string): Record<string, boolean> | null => {
    const savedPermissions = localStorage.getItem("sidebar_permissions");
    if (savedPermissions) {
        try {
            const permissions = JSON.parse(savedPermissions);
            return permissions[role] || null;
        } catch (e) {
            console.error("Error parsing sidebar permissions:", e);
        }
    }
    return null;
};

export const isMenuItemAllowed = (role: string, itemTitle: string, parentTitle?: string): boolean | undefined => {
    const rolePermissions = getRolePermissions(role);
    if (rolePermissions) {
        const key = parentTitle ? `${parentTitle}:${itemTitle}` : itemTitle;
        // If permissions exist for this role, deny by default unless explicitly true.
        // This prevents non-admin roles from seeing sections not granted to them.
        return rolePermissions[key] === true;
    }
    // No permissions saved at all → return undefined so the sidebar falls back to static allowedRoles
    return undefined;
};

export const isPathAllowed = (path: string, role: string): boolean => {
    // Fail-safe: Always allow Admins to access the root path and Settings
    // This prevents them from being locked out of the app entirely
    if (role === "admin") {
        if (path === "/admin" || path === "/admin/" || path === "/admin/settings") {
            return true;
        }
    }

    const rolePermissions = getRolePermissions(role);

    // Find the MOST SPECIFIC (longest URL) menu item matching this path.
    // This prevents short URLs like "/admin" from incorrectly blocking "/admin/settings".
    const findMenuItemByPath = (items: MenuItem[], currentPath: string, parentTitle?: string): { item: MenuItem; parentTitle?: string } | null => {
        let bestMatch: { item: MenuItem; parentTitle?: string } | null = null;
        let bestLength = 0;

        for (const item of items) {
            if (item.url && (currentPath === item.url || currentPath.startsWith(item.url + "/"))) {
                if (item.url.length > bestLength) {
                    bestMatch = { item, parentTitle };
                    bestLength = item.url.length;
                }
            }
            if (item.children) {
                const found = findMenuItemByPath(item.children, currentPath, item.title);
                if (found && found.item.url && found.item.url.length > bestLength) {
                    bestMatch = found;
                    bestLength = found.item.url.length;
                }
            }
        }
        return bestMatch;
    };

    const foundMatch = findMenuItemByPath(menuItems, path);

    // Evaluate permission
    if (foundMatch) {
        const { item, parentTitle } = foundMatch;
        const key = parentTitle ? `${parentTitle}:${item.title}` : item.title;

        // If saved permissions exist for this role, use them (deny by default)
        if (rolePermissions) {
            return rolePermissions[key] === true;
        }

        // No saved permissions: fall back to static allowedRoles in menuItems.ts
        if (item.allowedRoles && !item.allowedRoles.includes(role)) {
            return false;
        }
    }

    // No matching menu item found → allow (e.g., unknown/generic routes)
    return true;
};
