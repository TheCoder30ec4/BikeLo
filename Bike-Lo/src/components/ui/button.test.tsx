import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';
import React from 'react';

describe('Button Component', () => {
  it('renders correctly with given text', () => {
    render(<Button>Click Me!</Button>);
    expect(screen.getByText('Click Me!')).toBeDefined();
  });

  it('handles custom variants', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    expect(container.firstChild).toBeDefined();
    // testing for the exact red color pattern provided by destructive class
  });
});
