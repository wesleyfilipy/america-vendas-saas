import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock dos componentes que fazem chamadas externas
jest.mock('./components/layout/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('./components/layout/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('./pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home">Home Page</div>;
  };
});

// @ts-ignore - Jest environment
test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// @ts-ignore - Jest environment
describe('App Component', () => {
  // @ts-ignore - Jest environment
  it('renders without crashing', () => {
    // @ts-ignore - Jest environment
    expect(() => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  // @ts-ignore - Jest environment
  it('renders main content', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // @ts-ignore - Jest environment
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  // @ts-ignore - Jest environment
  it('renders navigation', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // @ts-ignore - Jest environment
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
}); 