const DROP_FROM_REG_EXP = [" ", "+", "^", "$", "*", "&", "#", "'"];

module.exports = {
  cleanSpotifyTitle (title) {
    // only take what is before ' -|: ' and not in parens '(.*)'
    let cleanedTitle = "";
    let betweenParens = false;
    let dashPoint = title.indexOf("-") + 1 || title.length + 1;
    let semipoint = title.indexOf(":") + 1 || title.length + 1;
    let endPoint = Math.min(dashPoint, semipoint) - 1;
    for (let i = 0; i < endPoint; i++) {
     if (betweenParens) {
       continue;
     } else if (title[i] === "(") {
       betweenParens = true;
     } else if (title[i] === ")" && betweenParens) {
       betweenParens = false;
     } else {
       cleanedTitle += title[i];
     }
    }
    return cleanedTitle.trim();
  },
  dropLeadingWords (str) {
    return str.replace(new RegExp("^the |^an |^a ", "ig"), "");
  },
  formatForRegExp (str) {
    let returnStr = "";
    let spaceOrStar = false;
    for (var i = 0; i < str.length; i++) {
      if (DROP_FROM_REG_EXP.includes(str[i])) {
        if (spaceOrStar) {
          continue;
        } else {
          returnStr += ".*";
          spaceOrStar = true;
        }
      } else {
        returnStr += str[i];
        spaceOrStar = false;
      }
    }
    return returnStr;
  },
  extractDuration (str) {
    const minutesMatch = str.match(new RegExp('PT(.*)M.*'));
    if (!minutesMatch) {
      const secondsMatch = str.match(new RegExp('PT(.*)S'));
      return parseInt(secondsMatch[1]);
    } else {
      const minutes = parseInt(minutesMatch[1]);
      const secondsMatch = str.match(new RegExp('PT.*M(.*)S'));
      const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
      return (minutes * 60) + seconds;
    }
  },
  formatQuery (track) {
    return `${track.artists[0]} ${this.cleanSpotifyTitle(track.title)}`;
  },
  titleWordRegExps (trackTitle) {
    const cleanTitle = this.cleanSpotifyTitle(trackTitle);
    return cleanTitle.split(' ').map(word => {
      return new RegExp(this.formatForRegExp(word), 'i');
    });
  },
  artistRegExps (artists) {
    return artists.map(artist => {
      return this.dropLeadingWords(artist).split(' ').map(word => {
        return new RegExp(this.formatForRegExp(word), 'i');
      });
    });
  },
  countNumSpaces (string) {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
      if (string[i] === ' ') {
        count++;
      }
    }
    return count;
  },
  spaceIndecies (string) {
    let indecies = [0];
    for (let i = 0; i < string.length - 1; i++) {
      if (string[i] === ' ') {
        indecies.push(i + 1);
      }
    }
    indecies.push(string.length);
    return indecies;
  }
};