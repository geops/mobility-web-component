function Elevator({ ...props }) {
  return (
    <svg
      fill="currentColor"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2 22h15V2H2zm14-1h-6V3h6zM3 3h6v18H3zm15.625 10h3.75L20.5 16zm3.75-2h-3.75L20.5 8z" />
    </svg>
  );
}

export default Elevator;
