'use client';
import SignInButton from '@/features/auth/components/SignInButton';
import { useUser } from '@/features/auth/hooks/useUser';
import { authService } from '@/features/auth/services/auth.service';
import { useFetchCompanyByUserId } from '@/features/company/hooks/queries/useFetchCompanyByuserId';
import { isUserAdmin } from '@/features/users/helpers/user.helper';
import { useFetchUserInfo } from '@/features/users/hooks/useFetchUserInfo';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { showErrorAlert } from '@/shared/utils/swal.utils';
import { Building2, CreditCard, LogOut, User, UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getUncachedImageUrl } from '../utils/image.util';

const Navbar = () => {
  const currentPath = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const { data: user, isFetching: isFetchingUser } = useUser();

  const { data: userInfo } = useFetchUserInfo(user?.id ?? '');

  const { data: companyInfo, isFetching: isFetchingCompany } =
    useFetchCompanyByUserId({
      id: user?.id ?? '',
    });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  async function handleSignOut() {
    try {
      await authService.signOut();
      window.location.assign('/');
    } catch (error: any) {
      showErrorAlert('ล้่มเหลวขณะออกจากระบบ');
    }
  }

  return (
    <header
      id="header"
      className="shadow-sm fixed w-full z-50 items-center flex h-[70px] bg-white px-24"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            className="cursor-pointer h-[70px] flex items-center justify-center overflow-hidden translate-y-[-5px]"
            href="/"
          >
            <Image src="/logo.png" alt="TempJob" width={100} height={100} />
          </Link>
          <nav className="flex gap-6">
            <Link href="/posted-jobs">
              <span
                className={`text-gray-600 hover:text-green-600 cursor-pointer ${
                  currentPath === '/posted-jobs' ? 'text-green-600' : ''
                }`}
              >
                งานที่ประกาศ
              </span>
            </Link>
            <Link href="/freelancers">
              <span
                className={`text-gray-600 hover:text-green-600 cursor-pointer ${
                  currentPath === '/freelancers' ? 'text-green-600' : ''
                }`}
              >
                ค้นหาผู้สมัครงาน
              </span>
            </Link>
            <Link href="/contact">
              <span
                className={`text-gray-600 hover:text-green-600 cursor-pointer ${
                  currentPath === '/contact' ? 'text-green-600' : ''
                }`}
              >
                ติดต่อเรา
              </span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-green-600">
            <i className="fa-regular fa-bell text-xl"></i>
          </button>

          <div className="relative" ref={menuRef}>
            {isFetchingUser || isFetchingCompany ? (
              <Skeleton className="w-8 h-8 rounded-full" />
            ) : user ? (
              companyInfo?.profile_image_url ? (
                <Image
                  src={
                    getUncachedImageUrl(companyInfo?.profile_image_url) ||
                    '/placeholder.png'
                  }
                  className="w-8 h-8 rounded-full cursor-pointer"
                  alt="Profile"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  width={32}
                  height={32}
                />
              ) : (
                <UserIcon
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-full cursor-pointer bg-gray-200 p-2"
                />
              )
            ) : (
              currentPath != '/sign-in' && <SignInButton />
            )}

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                <Link href="/company/profile" onClick={handleMenuItemClick}>
                  <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Building2 size={16} />
                    โปรไฟล์บริษัท
                  </div>
                </Link>

                {userInfo && isUserAdmin(userInfo) && (
                  <Link href="/admin" onClick={handleMenuItemClick}>
                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                      <User size={16} />
                      หน้าแอดมิน
                    </div>
                  </Link>
                )}
                <hr className="my-1" />
                <div
                  className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  ออกจากระบบ
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
