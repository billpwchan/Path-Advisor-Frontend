import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FullScreenOverlay from './FullScreenOverlay';
import style from './FullScreenOverlay.module.css';

describe('FullScreenOverlay', () => {
  it('should call onBodyClick if it click on anywhere', () => {
    const onBodyClick = jest.fn();
    const bodyText = 'Test children';
    const { getByText } = render(
      <FullScreenOverlay {...{ onBodyClick }}>{bodyText}</FullScreenOverlay>,
    );

    fireEvent.click(getByText(bodyText));
    expect(onBodyClick).toHaveBeenCalledTimes(1);
  });

  it('should not render close button if onCloseIconClick function is not provided', () => {
    const bodyText = 'Test children';
    const { queryByText } = render(<FullScreenOverlay>{bodyText}</FullScreenOverlay>);

    expect(queryByText('×')).not.toBeInTheDocument();
  });

  it('should render close button if onCloseIconClick function is provided', () => {
    const onCloseIconClick = () => {};
    const bodyText = 'Test children';
    const { queryByText } = render(
      <FullScreenOverlay {...{ onCloseIconClick }}>{bodyText}</FullScreenOverlay>,
    );

    expect(queryByText('×')).toBeInTheDocument();
  });

  it('should trigger onCloseIconClick on clicking close button', () => {
    const onCloseIconClick = jest.fn();
    const bodyText = 'Test children';
    const { getByText } = render(
      <FullScreenOverlay {...{ onCloseIconClick }}>{bodyText}</FullScreenOverlay>,
    );

    fireEvent.click(getByText('×'));
    expect(onCloseIconClick).toHaveBeenCalledTimes(1);
  });

  it('should add custom class name to body if provided', () => {
    const className = 'test001';
    const bodyText = 'Test children';
    const { container } = render(
      <FullScreenOverlay {...{ className }}>{bodyText}</FullScreenOverlay>,
    );
    expect(container.firstChild).toHaveClass(className);
  });

  it('should add center class if center prop is true', () => {
    const bodyText = 'Test children';
    const { container, getByText } = render(
      <FullScreenOverlay center>{bodyText}</FullScreenOverlay>,
    );
    expect(container.firstChild).toHaveClass(style.bodyCenter);
    expect(getByText(bodyText)).toHaveClass(style.center);
  });
});
