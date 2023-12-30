type Props = {
    children: React.ReactNode;
  };

  function Layout({ children }: Props) {
    return (
      <div className="flex h-screen w-full flex-col items-center">
        {children}
      </div>
    );
  }

  export default Layout;
