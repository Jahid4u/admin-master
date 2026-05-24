import React, { forwardRef } from "react";
import { useRouter, useRouterState, useParams as tsUseParams } from "@tanstack/react-router";

export const useLocation = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return { pathname };
};

export const useParams = <T extends Record<string, string> = Record<string, string>>() => {
  return tsUseParams({ strict: false }) as T;
};

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  children?: React.ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, children, onClick, ...rest }, ref) => {
    const router = useRouter();
    return (
      <a
        ref={ref}
        href={to}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          router.history.push(to);
        }}
        {...rest}
      >
        {children}
      </a>
    );
  }
);
Link.displayName = "Link";
