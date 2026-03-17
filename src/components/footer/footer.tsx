import React from "react";
import Link from "next/link";
import { footer } from "./config";
import { Button } from "../ui/button";
import SocialMediaButtons from "../social/social-media-icons";
import { config } from "@/data/config";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex w-full shrink-0 flex-col items-center gap-4 border-t border-border px-6 py-5 sm:flex-row sm:justify-between sm:gap-0">
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
        © {year} {config.author}. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        <SocialMediaButtons />
        {footer.length > 0 && (
          <nav className="flex gap-4 sm:gap-6 z-10">
            {footer.map((link, index) => {
              const { title, href } = link;
              return (
                <Link
                  className="text-xs underline-offset-4 hover:underline"
                  href={href}
                  key={`l_${index}`}
                >
                  <Button variant={"link"}>{title}</Button>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </footer>
  );
}

export default Footer;
