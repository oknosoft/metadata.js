import Lazy from '../DumbLoader/Lazy';

export default class SchemeSettingsObj extends Lazy {
  componentDidMount() {
    import('./SchemeSettingsObj').then((module) => this.setState({Component: module.default}));
  }
}
