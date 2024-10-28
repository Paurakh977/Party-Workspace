"use client";

import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SocialLinkDisplayer from "@/components/Tables/videolinkTable"; // Import the component

const SocialLinksPage: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        <Breadcrumb pageName="सामाजिक लिंक" />
        <div>
          {/* Social Link Displayer component */}
          <SocialLinkDisplayer />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SocialLinksPage;
