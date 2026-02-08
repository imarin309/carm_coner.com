"use client";

import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "./index";

function getMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  // eslint-disable-next-line react-hooks/static-components -- dynamic MDX component from velite
  return <Component components={mdxComponents} />;
}
