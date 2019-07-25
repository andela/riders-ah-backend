const readTime = (body, title, description) => {
  const countWords = body.split(' ').length + title.split(' ').length + description.split(' ').length;
  const wpm = 250; // read time estimation from google
  const time = Math.floor(countWords / wpm);

  if (time < 1) {
    return 'less than a minute read';
  }
  if (time >= 1 && time < 2) {
    return '1 minute read';
  }

  return `${time} minutes read`;
};

export default readTime;
