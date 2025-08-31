import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAuthenticated, selectIsLoading } from "@/store/selectors";

const AuthDebug = () => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div>Loading: {isLoading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User: {user ? JSON.stringify(user, null, 2) : 'null'}</div>
      <div>User Type: {typeof user}</div>
    </div>
  );
};

export default AuthDebug;