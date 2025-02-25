import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function WithAuthComponent(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get('token'); // Get token from cookies

      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/login'); // Redirect if no token
      }
    }, []);

    if (isAuthenticated === null) {
      return <p className="text-center text-gray-600">Checking authentication...</p>; // Show loading state
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
