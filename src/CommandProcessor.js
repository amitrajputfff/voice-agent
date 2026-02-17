/**
 * Command Processor - Voice command execution logic
 * Port of executeAction, fillFormDynamically, clickElementDynamically, navigateDynamically
 * from voice-navigation-advanced.tsx lines 133-772
 */

export class CommandProcessor {
  constructor(widget) {
    this.widget = widget;
  }

  /**
   * Execute action (lines 133-230)
   */
  executeAction(action, parameters = {}) {
    this.widget.log('🎯 [Execute Action]', action, parameters);
    
    // Action aliases - map various AI responses to correct actions
    const actionAliases = {
      'scroll_bottom': 'bottom',
      'scroll_to_bottom': 'bottom',
      'go_to_bottom': 'bottom',
      'scroll_top': 'top',
      'scroll_to_top': 'top',
      'go_to_top': 'top',
      'scroll_middle': 'middle',
      'scroll_to_middle': 'middle',
      'go_to_middle': 'middle',
      'go_back': 'back',
      'voice_ai_agent': 'voice_agent',
      'voice_ai': 'voice_agent',
    };
    
    // Apply alias mapping
    const mappedAction = actionAliases[action] || action;
    
    const actions = {
      // Scrolling
      'scroll_up': () => window.scrollBy({ top: -400, behavior: 'smooth' }),
      'scroll_down': () => window.scrollBy({ top: 400, behavior: 'smooth' }),
      'scroll_to_top': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      'scroll_to_bottom': () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }),
      'top': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      'bottom': () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }),
      'middle': () => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'smooth' }),
      
      // Zoom Commands
      'zoom_in': () => {
        const currentZoom = parseFloat(document.body.style.zoom || '1');
        document.body.style.zoom = `${currentZoom + 0.1}`;
      },
      'zoom_out': () => {
        const currentZoom = parseFloat(document.body.style.zoom || '1');
        document.body.style.zoom = `${Math.max(0.5, currentZoom - 0.1)}`;
      },
      'reset_zoom': () => {
        document.body.style.zoom = '1';
      },
      
      // Navigation (fallback for known routes)
      'home': () => this.navigateToPath('/'),
      'products': () => this.navigateToPath('/products'),
      'pricing': () => this.navigateToPath('/pricing'),
      'about': () => this.navigateToPath('/about-us'),
      'contact': () => this.navigateToPath('/contact-us'),
      'solutions': () => this.navigateToPath('/solutions'),
      'careers': () => this.navigateToPath('/careers'),
      'partners': () => this.navigateToPath('/partner-program'),
      
      // Products
      'chatbot': () => this.navigateToPath('/products/chatbot'),
      'voice_agent': () => this.navigateToPath('/products/voice-ai-agent'),
      'email_assistant': () => this.navigateToPath('/products/executive-email-assistant'),
      
      // Resources
      'roi_calculator': () => this.navigateToPath('/resources/roi-calculator'),
      'case_studies': () => this.navigateToPath('/resources/case-studies'),
      
      // Solutions
      'banking': () => this.navigateToPath('/solutions/industries/banking-finance'),
      'healthcare': () => this.navigateToPath('/solutions/industries/healthcare'),
      'ecommerce': () => this.navigateToPath('/solutions/industries/e-commerce'),
      
      // Dynamic Navigation
      'navigate': () => this.navigateDynamically(parameters),
      
      // Dynamic Form Filling
      'fill_form': () => this.fillFormDynamically(parameters),
      
      // Dynamic Click
      'click': () => this.clickElementDynamically(parameters),
      
      // System & Browser Navigation
      'back': () => window.history.back(),
      'forward': () => window.history.forward(),
      'refresh': () => window.location.reload(),
      'print': () => window.print(),
      'hide_commands': () => this.widget.setState({ showCommands: false }),
      'show_commands': () => this.widget.setState({ showCommands: true }),
      
      // Content
      'read': () => this.readPageContent(),
      'stop_reading': () => this.widget.stopSpeaking(),
    };

    const actionFn = actions[mappedAction];
    if (actionFn) {
      actionFn();
      return true;
    }
    return false;
  }

  /**
   * Navigate to path
   */
  navigateToPath(path) {
    window.location.href = path;
  }

  /**
   * Read page content
   */
  readPageContent() {
    const mainContent = document.querySelector('main') || document.querySelector('#main-content') || document.body;
    if (mainContent) {
      const text = mainContent.textContent?.slice(0, 500) || 'No content to read';
      this.widget.speak(text);
    }
  }

  /**
   * Fill form dynamically (lines 232-402)
   */
  fillFormDynamically(parameters) {
    this.widget.log('📝 [Fill Form] Parameters:', parameters);
    
    const { domAnalysis } = this.widget.state;
    
    if (!domAnalysis || domAnalysis.forms.length === 0) {
      this.widget.log('⚠️ [Fill Form] No forms found');
      return;
    }

    // Try to find the best matching form
    let targetForm = domAnalysis.forms[0]; // Default to first form
    
    // If there are multiple forms, try to find one with matching fields
    if (domAnalysis.forms.length > 1 && parameters) {
      const fieldKeys = Object.keys(parameters.fields || parameters);
      for (const form of domAnalysis.forms) {
        const hasMatchingField = form.fields.some(f => 
          fieldKeys.some(key => 
            f.name?.toLowerCase().includes(key.toLowerCase()) ||
            f.label?.toLowerCase().includes(key.toLowerCase()) ||
            f.type === key.toLowerCase() ||
            (key === 'email' && f.type === 'email')
          )
        );
        if (hasMatchingField) {
          targetForm = form;
          break;
        }
      }
    }

    this.widget.log('📋 [Fill Form] Using form:', targetForm.id, 'with', targetForm.fields.length, 'fields');

    // Extract field values
    const fieldValues = parameters.fields || parameters;
    this.widget.log('📦 [Fill Form] Field values to fill:', fieldValues);

    let filledCount = 0;
    const filledFields = [];

    // Fill each parameter into matching fields
    Object.entries(fieldValues).forEach(([key, value]) => {
      this.widget.log(`🔍 [Fill Form] Looking for field: ${key} = ${value}`);
      
      // Find matching field
      const field = targetForm.fields.find((f) => {
        const keyLower = key.toLowerCase();
        
        // Direct type match for email fields
        if (keyLower === 'email' && f.type === 'email') return true;
        
        // Check various field properties
        return f.name?.toLowerCase().includes(keyLower) ||
               f.label?.toLowerCase().includes(keyLower) ||
               f.id?.toLowerCase().includes(keyLower) ||
               f.placeholder?.toLowerCase().includes(keyLower) ||
               f.type === keyLower;
      });

      if (field) {
        this.widget.log(`✅ [Fill Form] Found field:`, field);
        
        let input = null;
        
        // Strategy 1: By type for email fields
        if (field.type === 'email') {
          const emailInputs = document.querySelectorAll('input[type="email"]');
          if (emailInputs.length === 1) {
            input = emailInputs[0];
            this.widget.log('🎯 [Fill Form] Found single email input on page');
          } else if (emailInputs.length > 1) {
            const formElement = document.querySelector(`#${targetForm.id}`) || 
                              document.querySelectorAll('form')[domAnalysis.forms.indexOf(targetForm)];
            if (formElement) {
              input = formElement.querySelector('input[type="email"]');
              if (input) this.widget.log('🎯 [Fill Form] Found email input in target form');
            }
          }
        }
        
        // Strategy 2: By name attribute
        if (!input && field.name && !field.name.startsWith('field-')) {
          input = document.querySelector(`input[name="${field.name}"], select[name="${field.name}"], textarea[name="${field.name}"]`);
          if (input) this.widget.log('🎯 [Fill Form] Found by name:', field.name);
        }
        
        // Strategy 3: By id attribute
        if (!input && field.id && !field.id.startsWith('field-')) {
          input = document.querySelector(`#${field.id}`);
          if (input) this.widget.log('🎯 [Fill Form] Found by ID:', field.id);
        }
        
        // Strategy 4: By label text
        if (!input && field.label) {
          const labels = Array.from(document.querySelectorAll('label'));
          const matchingLabel = labels.find(l => {
            const labelText = l.textContent?.trim().toLowerCase();
            return labelText === field.label?.toLowerCase() ||
                   labelText?.includes(field.label?.toLowerCase());
          });
          if (matchingLabel) {
            const forAttr = matchingLabel.getAttribute('for');
            if (forAttr) {
              input = document.querySelector(`#${forAttr}`);
              if (input) this.widget.log('🎯 [Fill Form] Found by label "for" attribute');
            } else {
              input = matchingLabel.querySelector('input, select, textarea');
              if (input) this.widget.log('🎯 [Fill Form] Found as child of label');
            }
          }
        }
        
        // Strategy 5: By placeholder
        if (!input && field.placeholder) {
          input = document.querySelector(`input[placeholder*="${field.placeholder}"], textarea[placeholder*="${field.placeholder}"]`);
          if (input) this.widget.log('🎯 [Fill Form] Found by placeholder:', field.placeholder);
        }
        
        // Strategy 6: By index in form
        if (!input && typeof field.index === 'number') {
          const formElement = document.querySelector(`#${targetForm.id}`) || 
                            document.querySelectorAll('form')[domAnalysis.forms.indexOf(targetForm)];
          if (formElement) {
            const allInputs = formElement.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
            input = allInputs[field.index];
            if (input) this.widget.log('🎯 [Fill Form] Found by index:', field.index);
          }
        }

        if (input) {
          // Focus the input
          input.focus();
          
          // Set the value
          input.value = value;
          
          // Trigger events for React/Vue/Angular
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          
          // For React 16+
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
          
          this.widget.log(`✨ [Fill Form] Successfully filled "${field.label || field.name || field.type}" with "${value}"`);
          filledCount++;
          filledFields.push(field.label || field.name || field.type);
        } else {
          this.widget.log(`⚠️ [Fill Form] Input element not found for field:`, field);
        }
      } else {
        this.widget.log(`⚠️ [Fill Form] No matching field found for "${key}"`);
      }
    });
    
    if (filledCount > 0) {
      const fieldNames = filledFields.join(', ');
      this.widget.log(`✅ [Fill Form] Successfully filled ${filledCount} field(s): ${fieldNames}`);
    } else {
      this.widget.log('⚠️ [Fill Form] Could not fill any fields');
    }
  }

  /**
   * Click element dynamically (lines 404-546)
   */
  clickElementDynamically(parameters) {
    this.widget.log('🖱️ [Click] Parameters:', parameters);
    
    const { domAnalysis } = this.widget.state;
    const target = parameters?.target || parameters?.element || parameters?.button || 'submit';
    const targetLower = target.toLowerCase();
    this.widget.log('🎯 [Click] Looking for:', target);

    let element = null;

    // 1. Try to find in form buttons
    if (domAnalysis?.forms.length) {
      for (const form of domAnalysis.forms) {
        this.widget.log(`🔍 [Click] Checking form ${form.id} buttons:`, form.buttons);
        
        const button = form.buttons?.find(b => 
          b.text?.toLowerCase().includes(targetLower) ||
          b.type?.toLowerCase().includes(targetLower) ||
          b.id?.toLowerCase().includes(targetLower) ||
          b.name?.toLowerCase().includes(targetLower) ||
          (targetLower.includes('submit') && b.type === 'submit') ||
          (targetLower.includes('subscribe') && (
            b.text?.toLowerCase().includes('subscribe') ||
            b.id?.toLowerCase().includes('subscribe') ||
            b.name?.toLowerCase().includes('subscribe')
          ))
        );

        if (button) {
          this.widget.log('✅ [Click] Found button in form:', button);
          
          // Try multiple selectors
          if (button.id && !button.id.startsWith('button-')) {
            element = document.querySelector(`#${button.id}`);
            if (element) this.widget.log('🎯 [Click] Found by ID:', button.id);
          }
          
          if (!element && button.name) {
            element = document.querySelector(`button[name="${button.name}"], input[name="${button.name}"]`);
            if (element) this.widget.log('🎯 [Click] Found by name:', button.name);
          }
          
          if (!element && button.text) {
            const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
            element = buttons.find(btn => 
              btn.textContent?.trim().toLowerCase() === button.text.toLowerCase() ||
              btn.value?.toLowerCase() === button.text.toLowerCase()
            );
            if (element) this.widget.log('🎯 [Click] Found by text:', button.text);
          }
          
          if (!element) {
            const formIndex = domAnalysis.forms.indexOf(form);
            const formElement = document.querySelectorAll('form')[formIndex];
            if (formElement) {
              element = formElement.querySelector('button[type="submit"], input[type="submit"], button:not([type="button"])');
              if (element) this.widget.log('🎯 [Click] Found submit button in form');
            }
          }
          
          if (element) break;
        }
      }
    }

    // 2. Try to find in interactions
    if (!element && domAnalysis?.interactions.length) {
      this.widget.log('🔍 [Click] Checking interactions:', domAnalysis.interactions.length);
      const interaction = domAnalysis.interactions.find(i =>
        i.text?.toLowerCase().includes(targetLower) ||
        i.ariaLabel?.toLowerCase().includes(targetLower) ||
        (targetLower.includes('subscribe') && (
          i.text?.toLowerCase().includes('subscribe') ||
          i.ariaLabel?.toLowerCase().includes('subscribe')
        ))
      );

      if (interaction) {
        this.widget.log('✅ [Click] Found interaction:', interaction);
        if (interaction.id) {
          element = document.querySelector(`#${interaction.id}`);
        }
        if (!element && interaction.text) {
          const elements = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a'));
          element = elements.find(el => 
            el.textContent?.trim().toLowerCase() === interaction.text.toLowerCase()
          );
        }
      }
    }

    // 3. Fallback: search by text content in DOM
    if (!element) {
      this.widget.log('🔍 [Click] Fallback: searching by text content in DOM');
      const clickables = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"], [role="button"]'));
      
      // First try exact match
      element = clickables.find(btn => {
        const text = btn.textContent?.trim().toLowerCase() || btn.value?.toLowerCase() || '';
        return text === targetLower;
      });
      
      // Then try contains match
      if (!element) {
        element = clickables.find(btn => {
          const text = btn.textContent?.trim().toLowerCase() || btn.value?.toLowerCase() || '';
          const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
          return text.includes(targetLower) || ariaLabel.includes(targetLower) ||
                 (targetLower.includes('subscribe') && (text.includes('subscribe') || ariaLabel.includes('subscribe'))) ||
                 (targetLower.includes('submit') && btn.getAttribute('type') === 'submit');
        });
      }
      
      if (element) {
        this.widget.log('🎯 [Click] Found by DOM search:', element);
      }
    }

    // Click the element
    if (element) {
      this.widget.log('✨ [Click] Clicking element:', element);
      
      // Scroll into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Small delay then click
      setTimeout(() => {
        element.click();
        this.widget.log('✅ [Click] Element clicked successfully');
      }, 100);
    } else {
      this.widget.log('⚠️ [Click] Element not found for:', target);
    }
  }

  /**
   * Navigate dynamically (lines 548-772)
   */
  navigateDynamically(parameters) {
    this.widget.log('🧭 [Navigate] Parameters:', parameters);
    
    const { domAnalysis, navigationMap } = this.widget.state;
    const destination = parameters?.destination || parameters?.target || parameters?.page || '';
    const destLower = destination.toLowerCase();
    this.widget.log('🎯 [Navigate] Looking for:', destination);

    if (!destination) {
      this.widget.log('⚠️ [Navigate] No destination specified');
      return;
    }

    let link = null;
    let targetPath = null;

    // STEP 0: Try NavigationMap first (Sitemap-based routing)
    if (navigationMap) {
      this.widget.log('🗺️ [Navigate] Checking navigation map...');
      const route = navigationMap.findRoute(destLower);
      
      if (route) {
        targetPath = route.path;
        this.widget.log('✅ [Navigate] Found in navigation map:', {
          path: route.path,
          matchedKeywords: route.keywords.filter(k => 
            k.includes(destLower) || destLower.includes(k)
          )
        });
      } else {
        this.widget.log('ℹ️ [Navigate] No match in navigation map');
      }
    }

    // STEP 1: Try DOM analysis navigation items
    if (!targetPath && domAnalysis?.navigation?.length) {
      this.widget.log('🔍 [Navigate] Checking navigation items:', domAnalysis.navigation.length);
      
      const navItem = domAnalysis.navigation.find(n => {
        const textLower = n.text?.toLowerCase() || '';
        const ariaLabelLower = n.ariaLabel?.toLowerCase() || '';
        const hrefLower = n.href?.toLowerCase() || '';
        
        if (!textLower && !ariaLabelLower && !hrefLower) {
          return false;
        }
        
        // Check text content
        if (textLower && (
          textLower.includes(destLower) || 
          destLower.includes(textLower) ||
          (destLower.includes('about') && textLower.includes('about')) ||
          (destLower.includes('contact') && textLower.includes('contact')) ||
          (destLower.includes('product') && textLower.includes('product')) ||
          (destLower.includes('pricing') && textLower.includes('pricing')) ||
          (destLower.includes('home') && (textLower === 'home' || textLower === 'liaplus'))
        )) {
          return true;
        }
        
        // Check aria-label
        if (ariaLabelLower && (
          ariaLabelLower.includes(destLower) ||
          destLower.includes(ariaLabelLower) ||
          (destLower.includes('about') && ariaLabelLower.includes('about')) ||
          (destLower.includes('contact') && ariaLabelLower.includes('contact')) ||
          (destLower.includes('product') && ariaLabelLower.includes('product')) ||
          (destLower.includes('pricing') && ariaLabelLower.includes('pricing'))
        )) {
          return true;
        }
        
        // Check href
        if (hrefLower && (
          hrefLower.includes(destLower.replace(/\s+/g, '-')) ||
          hrefLower.includes(destLower.replace(/\s+/g, ''))
        )) {
          return true;
        }
        
        return false;
      });

      if (navItem) {
        this.widget.log('✅ [Navigate] Found navigation item:', navItem);
        
        // Try to find the actual link element
        if (navItem.href) {
          link = document.querySelector(`a[href="${navItem.href}"]`);
          if (!link) {
            const links = Array.from(document.querySelectorAll('a'));
            link = links.find(a => a.href.includes(navItem.href));
          }
        }
        
        if (!link && navItem.text) {
          const links = Array.from(document.querySelectorAll('a'));
          link = links.find(a => 
            a.textContent?.trim().toLowerCase() === navItem.text.toLowerCase()
          );
        }
        
        if (!link && navItem.ariaLabel) {
          const links = Array.from(document.querySelectorAll('a'));
          link = links.find(a => 
            a.getAttribute('aria-label')?.toLowerCase() === navItem.ariaLabel.toLowerCase()
          );
        }
      }
    }

    // 2. Fallback: Search all links
    if (!targetPath && !link) {
      this.widget.log('🔍 [Navigate] Fallback: searching all links');
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      
      // First try exact text match
      link = allLinks.find(a => {
        const text = a.textContent?.trim().toLowerCase() || '';
        const ariaLabel = a.getAttribute('aria-label')?.toLowerCase() || '';
        return text === destLower || ariaLabel === destLower;
      }) || null;
      
      // Then try scoring
      if (!link) {
        const scoredLinks = allLinks.map(a => {
          const text = a.textContent?.trim().toLowerCase() || '';
          const ariaLabel = a.getAttribute('aria-label')?.toLowerCase() || '';
          const href = a.href.toLowerCase();
          let score = 0;
          
          if (text === destLower || ariaLabel === destLower) score += 100;
          if (text.includes(destLower)) score += 50;
          if (destLower.includes(text) && text.length > 2) score += 30;
          if (ariaLabel.includes(destLower)) score += 40;
          if (destLower.includes(ariaLabel) && ariaLabel.length > 2) score += 25;
          
          const urlPath = new URL(a.href, window.location.origin).pathname.toLowerCase();
          const destSlug = destLower.replace(/\s+/g, '-');
          if (urlPath.includes(destSlug)) score += 35;
          if (urlPath.includes(destLower.replace(/\s+/g, ''))) score += 30;
          
          // Specific page matches
          if (destLower.includes('about') && (text.includes('about') || ariaLabel.includes('about') || href.includes('about'))) score += 60;
          if (destLower.includes('contact') && (text.includes('contact') || ariaLabel.includes('contact') || href.includes('contact'))) score += 60;
          if (destLower.includes('product') && (text.includes('product') || ariaLabel.includes('product') || href.includes('product'))) score += 60;
          if (destLower.includes('pricing') && (text.includes('pricing') || ariaLabel.includes('pricing') || href.includes('pricing'))) score += 60;
          if (destLower.includes('home') && (href === '/' || href.endsWith('/') || text === 'home' || ariaLabel === 'home')) score += 60;
          
          if (!text && !ariaLabel) score -= 50;
          
          return { link: a, score };
        });
        
        scoredLinks.sort((a, b) => b.score - a.score);
        
        if (scoredLinks[0]?.score > 20) {
          link = scoredLinks[0].link;
          this.widget.log('🎯 [Navigate] Best match found:', {
            text: link.textContent?.trim(),
            ariaLabel: link.getAttribute('aria-label'),
            href: link.href,
            score: scoredLinks[0].score
          });
        }
      }
    }

    // Navigate
    if (targetPath) {
      this.widget.log('✨ [Navigate] Navigating to path:', targetPath);
      window.location.href = targetPath;
      this.widget.log('✅ [Navigate] Navigation initiated');
    } else if (link) {
      this.widget.log('✨ [Navigate] Navigating to:', link.href);
      
      const isExternal = link.hostname !== window.location.hostname;
      
      if (isExternal) {
        window.open(link.href, '_blank');
      } else {
        window.location.href = link.href;
      }
      
      this.widget.log('✅ [Navigate] Navigation initiated');
    } else {
      this.widget.log('⚠️ [Navigate] Link not found for:', destination);
    }
  }
}
