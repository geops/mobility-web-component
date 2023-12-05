function Airport({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 14 14"
      {...props}
    >
      <path d="m 14,8 0,1 -6,-1 0,3 2,2 0,1 L 7,13 4,14 4,13 6,11 6,8 0,9 0,8 6,5 6,2 C 6,1 6.22222,0 7,0 7.77777,0 8,1 8,2 l 0,3 z" />
    </svg>
  );
}

export default Airport;
