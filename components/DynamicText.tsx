import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';

interface DynamicTextProps extends TextProps {
  children: string;
  translationKey?: string;
}

const DynamicText: React.FC<DynamicTextProps> = ({ 
  children, 
  translationKey,
  style,
  ...props 
}) => {
  const { t } = useTranslation();
  
  // If a translation key is provided, use it
  // Otherwise, just display the text as-is
  const displayText = translationKey ? t(translationKey) : children;
  
  return (
    <Text style={style} {...props}>
      {displayText}
    </Text>
  );
};

export default DynamicText; 