import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { JobCard } from './JobCard';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
}));

describe('JobCard', () => {
  const mockOnSelectJob = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders job details correctly when unlocked', () => {
    render(
      <I18nProvider>
        <JobCard
          jobId="farmer"
          nameKey="job_farmer_title"
          descriptionKey="job_farmer_description"
          requiredLevel={1}
          playerLevel={1}
          onSelectJob={mockOnSelectJob}
        />
      </I18nProvider>
    );

    expect(screen.getByText('job_farmer_title')).toBeTruthy();
    expect(screen.getByText('job_farmer_description')).toBeTruthy();
    expect(screen.getByText('job_card_required_level')).toHaveTextContent('1');
    expect(screen.queryByText('job_card_locked')).toBeNull();
    expect(screen.getByText('job_card_start_button')).toBeEnabled();
  });

  it('renders job details correctly when locked', () => {
    render(
      <I18nProvider>
        <JobCard
          jobId="baker"
          nameKey="job_baker_title"
          descriptionKey="job_baker_description"
          requiredLevel={5}
          playerLevel={3}
          onSelectJob={mockOnSelectJob}
        />
      </I18nProvider>
    );

    expect(screen.getByText('job_baker_title')).toBeTruthy();
    expect(screen.getByText('job_baker_description')).toBeTruthy();
    expect(screen.getByText('job_card_required_level')).toHaveTextContent('5');
    expect(screen.getByText('job_card_locked')).toBeTruthy();
    expect(screen.getByText('job_card_unlock_more')).toBeDisabled();
  });

  it('calls onSelectJob when unlocked button is pressed', () => {
    render(
      <I18nProvider>
        <JobCard
          jobId="farmer"
          nameKey="job_farmer_title"
          descriptionKey="job_farmer_description"
          requiredLevel={1}
          playerLevel={1}
          onSelectJob={mockOnSelectJob}
        />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('job_card_start_button'));
    expect(mockOnSelectJob).toHaveBeenCalledWith('farmer');
  });

  it('does not call onSelectJob when locked button is pressed', () => {
    render(
      <I18nProvider>
        <JobCard
          jobId="baker"
          nameKey="job_baker_title"
          descriptionKey="job_baker_description"
          requiredLevel={5}
          playerLevel={3}
          onSelectJob={mockOnSelectJob}
        />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('job_card_unlock_more'));
    expect(mockOnSelectJob).not.toHaveBeenCalled();
  });

  it('adjusts text alignment for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <I18nProvider>
        <JobCard
          jobId="farmer"
          nameKey="job_farmer_title"
          descriptionKey="job_farmer_description"
          requiredLevel={1}
          playerLevel={1}
          onSelectJob={mockOnSelectJob}
        />
      </I18nProvider>
    );

    expect(getByText('job_farmer_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('job_farmer_description').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('job_card_required_level').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('job_card_start_button').parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-end' }));
  });

  it('adjusts text alignment for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    const { getByText } = render(
      <I18nProvider>
        <JobCard
          jobId="farmer"
          nameKey="job_farmer_title"
          descriptionKey="job_farmer_description"
          requiredLevel={1}
          playerLevel={1}
          onSelectJob={mockOnSelectJob}
        />
      </I18nProvider>
    );

    expect(getByText('job_farmer_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('job_farmer_description').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('job_card_required_level').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('job_card_start_button').parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-start' }));
  });
});
