

import { useEffect } from "react";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get('auth_token'); // Get token from cookies

      if (!token) {
        router.push('/login'); // Redirect to login if token is missing
      }
    }, [router]);

    return <Component {...props} />;
  };
}
