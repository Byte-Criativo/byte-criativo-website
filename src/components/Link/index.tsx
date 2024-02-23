import { LinkProps } from "next/link";
import { LinkContainer } from "./styles";
import Image from "next/image"
import React from "react";

interface LinkComponentProps extends LinkProps {
  children?: string
  icon?: React.ReactNode
}

export function Link({ icon, children, ...props}: LinkComponentProps) {
  return (
    <LinkContainer target="_blank" {...props}>
      {children}
      {icon}
    </LinkContainer>
  )
}