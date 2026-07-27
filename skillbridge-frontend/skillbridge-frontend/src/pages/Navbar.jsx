const { logout } = useAuth();
const handleLogout = () => { logout(); window.location.href = "/login"; };