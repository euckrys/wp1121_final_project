type Props = {
    children: React.ReactNode;
};

export default function Layout({ children }: Props) {
    return (
      <div className="flex h-screen w-full flex-col">
        {children}
      </div>
    );
}
