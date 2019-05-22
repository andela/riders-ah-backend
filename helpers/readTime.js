const readTime = (body, title, description) => {
  const countWords = body.split(' ').length + title.split(' ').length + description.split(' ').length;
  const wpm = 250; // read time estimation from google
  const time = Math.floor(countWords / wpm);

  if (time < 1) {
    return 'read of less than a minute';
  }
  if (time >= 1 && time < 2) {
    return 'read of one minute';
  }

  return `read of ${time} minutes`;
};

export default readTime;
