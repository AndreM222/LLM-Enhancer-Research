'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import Link from 'next/link';

function paths({ pathName }: { pathName: string }): [string, string][] {
  const tabs = pathName
    .split('\/')
    .map((item) => item)
    .filter((item) => item !== '');

  let newPaths: [string, string][] = [];
  let currPath: string = '/';

  tabs.map((item) => {
    currPath += item;
    newPaths.push([item.charAt(0).toUpperCase() + item.slice(1), currPath]);
  });

  const lastIndex: number = newPaths.length - 1;
  if (newPaths.length > 0) newPaths[lastIndex][1] = '';

  return newPaths;
}

export default function DynamicCrumbs() {
  const pathName: string = usePathname();

  const tabs = paths({ pathName });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        {tabs.map((item) => (
          <div className="flex items-center" key={item[1]}>
            <BreadcrumbSeparator className="hidden md:block pr-1" />
            <BreadcrumbItem>
              {item[1] ? (
                <BreadcrumbLink asChild>
                  <Link href={item[1]}>{item[0]}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item[0]}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
