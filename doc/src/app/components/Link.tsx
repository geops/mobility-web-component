function Link({ children, ...props }: React.JSX.IntrinsicElements["a"]) {
  return (
    <a rel="noreferrer" target="_blank" {...props}>
      <b>{children}</b>
    </a>
  );
}

export default Link;
