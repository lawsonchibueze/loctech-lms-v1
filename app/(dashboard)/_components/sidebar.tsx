// import { Logo } from "./logo";
import Link from "next/link";
import { SidebarRoutes } from "./sidebar-routes";
// import logo from "./logo.png";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Link href="/search">
          <Image src="/logo.png" height={100} width={100} alt="logo" />
        </Link>

        {/* <Logo /> */}
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
