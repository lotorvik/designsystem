import React, {PropTypes} from 'react';
import BaseSelector from './base-selector';
import AccountSuggestionItemMulti from '../account/account-suggestion-multi';
import AccountNoMatch from '../account/account-nomatch';
import {Account, Locale} from '../util/types';
import {accountFilter} from '../filter/filters';
import StatusBar from '../suggestion/suggestion-list-status-bar';

let baseRef;
let shouldHideSuggestions;

class AccountSelectorMulti extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestionListHeight: 0
    };
  }

  renderSuggestion(account) {
    const {locale, selectedAccounts} = this.props;
    const isSelected = selectedAccounts.filter(a => a.accountNumber === account.accountNumber);
    return (
      <AccountSuggestionItemMulti
        account={account}
        locale={locale}
        selected={isSelected.length > 0}
        onChange={() => baseRef.preventBlurForNextMouseClick()}
      />
    );
  }

  onBlur() {
    if (shouldHideSuggestions) {
      baseRef.showHideSuggestions(false);
      this.props.onBlur();
    }
    shouldHideSuggestions = true;
  }

  onDone() {
    baseRef.setFocus();
    baseRef.showHideSuggestions(false);
    this.props.onBlur();
  }

  renderSuggestionDetails(listHeight) {
    let statusText;
    const {selectedAccounts} = this.props;
    if (selectedAccounts.length === 0) {
      statusText = 'Ingen kontoer valgt';
    } else if (selectedAccounts === 1) {
      statusText = '1 konto valgt';
    } else {
      statusText = `${selectedAccounts.length} kontoer valgt`;
    }
    const height = listHeight + 45;
    return (
      <StatusBar
        renderSelectionStatus={() => statusText}
        onDone={() => this.onDone()}
        labelDoneButton="Ferdig"
        style={{position: 'absolute', zIndex: 100, top: height}}
      />
    );
  }

  render() {
    const {noMatches, onAccountSelected, accounts} = this.props;
    return (
      <div className='account-selector'>
        <BaseSelector
          renderSuggestion={(account) => this.renderSuggestion(account)}
          renderNoMatches={() => <AccountNoMatch value={noMatches}/>}
          suggestionDetails={this.renderSuggestionDetails()}
          shouldHideSuggestionsOnSelect={false}
          shouldSelectHighlightedOnTab={false}
          shouldHideSuggestionOnBlur={false}
          onTab={() => {shouldHideSuggestions = event.shiftKey;}}
          suggestionFilter={accountFilter}
          onSelect={onAccountSelected}
          onSuggestionListChange={(height) => {
            this.setState({suggestionListHeight: height});
          }}
          suggestions={accounts}
          ref={(element) => {
            if (element) {
              baseRef = element;
            }
          }
          }
          {...this.props}
          onBlur={(e) => this.onBlur(e)}
        />
        {this.state.suggestionListHeight > 0 && this.renderSuggestionDetails(this.state.suggestionListHeight)}
      </div>
    );
  }
}

AccountSelectorMulti.propTypes = {
  onAccountSelected : PropTypes.func.isRequired,
  accounts : PropTypes.arrayOf(Account),
  locale: Locale.isRequired,
  selectedAccounts: PropTypes.arrayOf(Account),
  noMatches: PropTypes.string,
  onBlur: PropTypes.func.isRequired
};

export default AccountSelectorMulti;
