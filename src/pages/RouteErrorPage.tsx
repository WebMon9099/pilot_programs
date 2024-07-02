const RouteErrorPage: React.FC = () => {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-[64px] px-[16px] py-[24px] text-center text-theme-extra-dark-gray">
      <p className="text-[30px] font-semibold text-theme-medium-gray">
        You cannot access this page directly.
      </p>
      <button
        className="rounded-full bg-theme-medium-gray px-[24px] py-[8px] text-[14px] font-semibold text-white transition duration-75 hover:scale-105 hover:shadow-md active:scale-95 active:brightness-95"
        onClick={() => window.history.back()}
      >
        Go back to Activities
      </button>
    </main>
  );
};

export default RouteErrorPage;
