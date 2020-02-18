import React, { Component, Link } from "react";

import Autosuggest from "react-autosuggest";
var AutosuggestHighlightMatch = require("autosuggest-highlight/match");
var AutosuggestHighlightParse = require("autosuggest-highlight/parse");

// const people = [
//   {
//     first: "Sally",
//     last: "Owner"
//   },
//   {
//     first: "Charlotte",
//     last: "White"
//   },
//   {
//     first: "Chloe",
//     last: "Jones"
//   },
//   {
//     first: "Cooper",
//     last: "King"
//   }
// ];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestions(value, ownerAccountsForSearch) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }

  const regex = new RegExp("\\b" + escapedValue, "i");

  return ownerAccountsForSearch.filter(person => regex.test(getSuggestionValue(person)));
}

function getSuggestionValue(suggestion) {
  return `${suggestion.first} ${suggestion.last}`;
}

function renderSuggestion(suggestion, { query }) {
  const suggestionText = `${suggestion.first} ${suggestion.last}`;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);

  return (
    // background-image: url(https://s3.amazonaws.com/uifaces/faces/twitter/steveodom/48.jpg);
    // suggestion.url
    <span className={"suggestion-content"} style={{ backgroundSize: "50px", backgroundImage: "url(" + suggestion.imgSrc + ")" }}>
      <span className="name">
        {parts.map((part, index) => {
          const className = part.highlight ? "highlight" : null;

          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
    </span>
  );
}

// https://react-autosuggest.js.org/
class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: [],
      mypassAccounts: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    console.log(suggestion);
    console.log(event);

    this.props.ownerSelectedFromDropdown(suggestion);

    // this.props.history.push("/");
    // this.props.history.push(
    //   "/profile/" +
    //     suggestion.last
    //       .toLowerCase()
    //       .split(" ")
    //       .join("") +
    //     "-" +
    //     suggestion.first
    //       .toLowerCase()
    //       .split(" ")
    //       .join("") +
    //     "-" +
    //     suggestion.schoolName
    //       .toLowerCase()
    //       .split(" ")
    //       .join("")
    // );
  };
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.ownerAccountsForSearch)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onComponentDidMount = () => {
    console.log("hi");
    // this.getAllAccounts();
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Search for owner",
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        onSuggestionSelected={this.onSuggestionSelected}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default SearchBar;
