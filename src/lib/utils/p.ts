function p(path: string) {
  return process.env.NODE_ENV === 'development'
    ? `/${path}`
    : `/programs/${path}`;
}

export default p;
