import { useAuthContext } from '@/context/AuthContext';

interface FlagContainerProps {
  view: boolean;
  children: React.ReactNode;
}

const FlagView = ({ view, children }: FlagContainerProps) => {
  const { user } = useAuthContext();

  const shouldView = user?.permissions?.[view] || false;

  if (!shouldView) {
    return null;
  }

  return <>{children}</>;
};

export default FlagView;
