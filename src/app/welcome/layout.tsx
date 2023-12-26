type Props = {
    children: React.ReactNode;
  };

  function Layout({ children }: Props) {
    return (
      <div className="flex h-screen w-2/6 flex-col items-center">
        {children}
      </div>
    );
  }

  export default Layout;
