import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Panel;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.text.DecimalFormat;
import java.text.NumberFormat;

// GraphPanel - user interface for experimentation with NNOD
// Copyright (C) 2018  Sergey Tolkachev
// use web_control.html to clone, excite, etc.

class GraphPanel extends Panel
implements Runnable, MouseListener, MouseMotionListener 
{
	private static final long serialVersionUID = 1L;
	final Color selectedColor = Color.green;
    final Color selectColor = Color.pink;
    final Color linkColor = new Color(0x99, 0xcc, 0xff);
    final Color cloneColor = new Color(0xff, 0xff, 0xcc);
    final Color inputColor = new Color(0xBB, 0xFF, 0xFF);
    final Color arcColor = Color.blue;
    final int Sleep_Time = 100;

	Font font1 =  new Font("Helvetica", Font.PLAIN, 12);
	Font font2 =  new Font("Helvetica", Font.BOLD, 12);
    
    int al = 8;		// Arrow length
    int aw = 6;		// Arrow width
    int haw = aw/2;	// Half arrow width
    int xValues[] = new int[3];
    int yValues[] = new int[3];

    int d_Box = 14;		
    
    boolean relax = false;
    boolean pickfixed;
    boolean random;
    Neuron neuron = null;
    Neuron.Node pick;

    Neuro_Layer graph;
    Image offscreen;
    Dimension offscreensize;
    Graphics offgraphics;
    
   	Thread relaxer;
    
    GraphPanel(Neuro_Layer graph, Neuron n) 
	{
    	this.neuron = n;
    	this.graph = graph;
    	addMouseListener(this);
	}


//********************************************************
//	RELAX
//********************************************************
    synchronized void relax() 
    {
	    if (!relax) return;
	    
    	for (int i = 0 ; i < neuron.nnerves ; i++) 
    	{
    		Neuron.Nerve e = neuron.nerves[i];
    		double vx = neuron.nodes[e.to].x - neuron.nodes[e.from].x;
    		double vy = neuron.nodes[e.to].y - neuron.nodes[e.from].y;
    		double len = Math.sqrt(vx * vx + vy * vy);
    		len = (len == 0) ? .0001 : len;
    		double f = (neuron.nerves[i].len - len) / (len * 5);
    		double dx = f * vx;
    		double dy = f * vy;
    		neuron.nodes[e.to].dx += dx;
    		neuron.nodes[e.to].dy += dy;
    		neuron.nodes[e.from].dx += -dx;
    		neuron.nodes[e.from].dy += -dy;
    	}
  	
    	for (int i = 0 ; i < neuron.nnodes ; i++) 
    	{
    		Neuron.Node n1 = neuron.nodes[i];
    		double dx = 0;
    		double dy = 0;
    		for (int j = 0 ; j < neuron.nnodes ; j++) 
    		{
    			if (i == j) 
    			{
    				continue;
    			}
    			Neuron.Node n2 = neuron.nodes[j];
    			double vx = n1.x - n2.x;
    			double vy = n1.y - n2.y;
    			double len = vx * vx + vy * vy;
    			if (len == 0) 
    			{
    				dx += Math.random();
    				dy += Math.random();
    			} else if (len < 100*100) 
    			{
    				dx += vx / len;
    				dy += vy / len;
    			}
    		}
    		double dlen = dx * dx + dy * dy;
    		if (dlen > 0) 
    		{
    			dlen = Math.sqrt(dlen) / 2;
    			n1.dx += dx / dlen;
    			n1.dy += dy / dlen;
    		}
    	}
    	Dimension d = getSize();
    	d.width -= 20;
    	d.height -= 20;
    	
    	for (int i = 0 ; i < neuron.nnodes ; i++) 
    	{
    		Neuron.Node n = neuron.nodes[i];
    		if (!n.fixed) 
    		{
    			n.x += Math.max(-5, Math.min(5, n.dx));
    			n.y += Math.max(-5, Math.min(5, n.dy));
    		}
    		if (n.x < 40) 
    		{
    			n.x = 40;
    		} else if (n.x > d.width) 
    		{
    			n.x = d.width;
    		}
    		if (n.y < 30) 
    		{
    			n.y = 30;
    		} else if (n.y > d.height)
    		{
    			n.y = d.height;
    		}
    		n.dx /= 2;
    		n.dy /= 2;
    	}
    }
    
//********************************************************
//	PAINT NODE
//********************************************************
    public void paintNode(Graphics g, Neuron.Node n, FontMetrics fm) 
    {
    	int x = (int)n.x;
    	int y = (int)n.y;
    	Color nodeColor = new Color(n.R, n.G, n.B);
    	
    	g.setColor(nodeColor);
    	
    	int w = n.w;
    	int h = n.h;
    	g.fillRect(x - w/2, y - h/2, w, h);
    	g.setFont(font1);
    	g.setColor(Color.LIGHT_GRAY);
    	g.fillRect(x - w/2, y - h/2, d_Box, d_Box);
    	g.setColor(Color.black);
    	g.drawString("E", x - w/2 + 4, y - h/2 + 12);
    	
    	g.setColor(Color.LIGHT_GRAY);
    	g.fillRect(x + w/2 - d_Box, y - h/2, d_Box, d_Box);
    	g.setColor(Color.black);
    	g.drawString("S", x + w/2 - w/4 + 4, y - h/2 + 12);
    	
    	g.setColor(Color.LIGHT_GRAY);
    	g.fillRect(x - w/2, y + h/2 - d_Box, d_Box, d_Box);
    	g.setColor(Color.black);
    	g.drawString("L", x - w/2 + 4, y + h/2 - 2);
    	
    	g.setColor(Color.LIGHT_GRAY);
    	g.fillRect(x + w/2 - d_Box, y + h/2 - d_Box, d_Box, d_Box);
    	g.setColor(Color.black);
    	g.drawString("C", x + w/2 - w/4 + 4, y + h/2 - 2);
    	
    	if (n.O > 0)
    		{
    			g.setColor(Color.pink);
    		}else
    		{
    			g.setColor(Color.WHITE);
    		}
    	g.fillRect(x - d_Box/2, y - h/2, d_Box, d_Box);
    	g.setColor(Color.black);
    	g.drawString("O", x - d_Box/2 + 2, y - h/2 + 12);
    	
    	g.setColor(inputColor);
    	g.fillRect(x - d_Box/2, y + h/2 - d_Box, d_Box, d_Box);
    	g.setColor(Color.black);
    	g.drawString("I", x - 2, y + h/2 - d_Box + 12);

    	g.setFont(font2);
    	g.setColor(Color.blue);
    	g.drawRect(x - w/2, y - h/2, w-1, h-1);
  		g.drawString(n.name, x-4, y+4);
    }
    
//********************************************************
//  DRAW ARROW
//  Frans Coenen
//  University of Liverpool, Dept of Comp. Sci.
//  Friday 12 January 2002
//********************************************************   
	public void drawArrow(Graphics g, int x1, int y1, int x2, int y2) 
	{
		g.drawLine(x1,y1,x2,y2);
		calcValues(x1,y1,x2,y2);
		g.fillPolygon(xValues,yValues,3);
	}
	public void calcValues(int x1, int y1, int x2, int y2) 
	{
		if (x1 == x2)
		{ 
			if (y2 < y1) arrowCoords(x2,y2,x2-haw,y2+al,x2+haw,y2+al);
			else arrowCoords(x2,y2,x2-haw,y2-al,x2+haw,y2-al);
			return;
		}	
		if (y1 == y2) 
		{
			if (x2 > x1) arrowCoords(x2,y2,x2-al,y2-haw,x2-al,y2+haw);
			else arrowCoords(x2,y2,x2+al,y2-haw,x2+al,y2+haw);
			return;
		}
		calcValuesQuad(x1,y1,x2,y2);
	}
	public void calcValuesQuad(int x1, int y1, int x2, int y2) 
	{ 
		double arrowAng = Math.toDegrees (Math.atan((double) haw/(double) al));
		double dist = Math.sqrt(al*al + aw);
		double lineAng = Math.toDegrees(Math.atan(((double) Math.abs(x1-x2)) / ((double) Math.abs(y1-y2))));
		if (x1 > x2) 
		{
			if (y1 > y2) lineAng = 180.0-lineAng;
		}else 
		{
			if (y1 > y2) lineAng = 180.0+lineAng;
		    else lineAng = 360.0-lineAng;
		}
			xValues[0] = x2;
			yValues[0] = y2;	
			calcCoords(1,x2,y2,dist,lineAng-arrowAng);
			calcCoords(2,x2,y2,dist,lineAng+arrowAng);
		} 
	public void calcCoords(int index, int x, int y, double dist, double dirn) 
	 {
	 	while(dirn < 0.0)   dirn = 360.0+dirn;
		while(dirn > 360.0) dirn = dirn-360.0;
		if (dirn <= neuron.length) 
		{
			xValues[index] = x + (int) (Math.sin(Math.toRadians(dirn))*dist);
			yValues[index] = y - (int) (Math.cos(Math.toRadians(dirn))*dist);
		    return;
		}
		if (dirn <= 180.0) 
		{
		    xValues[index] = x + (int) (Math.cos(Math.toRadians(dirn-neuron.length))*dist);
		    yValues[index] = y + (int) (Math.sin(Math.toRadians(dirn-neuron.length))*dist);
		    return;
		}
		if (dirn <= neuron.length) 
		{
			xValues[index] = x - (int) (Math.sin(Math.toRadians(dirn-180))*dist);
		    yValues[index] = y + (int) (Math.cos(Math.toRadians(dirn-180))*dist);
		} else 
		{
		    xValues[index] = x - (int) (Math.cos(Math.toRadians(dirn-270))*dist);
		    yValues[index] = y - (int) (Math.sin(Math.toRadians(dirn-270))*dist);
		}
	}      
	public void arrowCoords(int x1, int y1, int x2, int y2, int x3, int y3) 
	{
		xValues[0] = x1;
		yValues[0] = y1;
		xValues[1] = x2;
		yValues[1] = y2;
		xValues[2] = x3;
		yValues[2] = y3;
	}
//********************************************************
//  REDRAW GRAPHICS
//********************************************************  
    public synchronized void update(Graphics g) 
    {
    	Dimension d = getSize();
    	if ((offscreen == null) || (d.width != offscreensize.width) || (d.height != offscreensize.height)) 
    	{
    		offscreen = createImage(d.width, d.height);
    		offscreensize = d;
    		if (offgraphics != null) 
    		{
    			offgraphics.dispose();
    		}
    		offgraphics = offscreen.getGraphics();
    		offgraphics.setFont(getFont());
    	}
    	
    	offgraphics.setColor(getBackground());
    	offgraphics.fillRect(0, 0, d.width, d.height); 	
    	FontMetrics fm = offgraphics.getFontMetrics();
    	for (int i = 0 ; i < neuron.nnodes ; i++)
    	{
    		paintNode(offgraphics, neuron.nodes[i], fm);
    	}
    	for (int i = 0 ; i < neuron.nnerves ; i++) 
    	{
    		Neuron.Nerve e = neuron.nerves[i];
    		
    		int x1 = (int)neuron.nodes[e.from].x;
    		int y1 = (int)neuron.nodes[e.from].y;
    		int x2 = (int)neuron.nodes[e.to].x;
    		int y2 = (int)neuron.nodes[e.to].y;
    		
    		y1 = y1 - neuron.nodes[e.from].h / 2;
    		y2 = y2 + neuron.nodes[e.to].h  / 2;

    		if (e.W > 0)offgraphics.setColor(Color.RED);
    		if (e.W == 0)offgraphics.setColor(Color.GRAY);
    		if (e.W < 0)offgraphics.setColor(Color.BLUE);
 //  		 	offgraphics.setColor(Color.blue);
   		 	drawArrow(offgraphics, x1, y1, x2, y2);
//   		offgraphics.drawLine(x1, y1, x2, y2);
   		 	
   		 	NumberFormat pattern = new DecimalFormat("##0.00");  		 
    		String lbl = pattern.format(e.W); 
    		offgraphics.setFont(font1);
    		
    		offgraphics.drawString(lbl, x1 + (x2-x1)/3, y1 + (y2-y1)/3);

    	}
    	g.drawImage(offscreen, 0, 0, null);
    }
    
//********************************************************
//	MOUSE EVENTS
//********************************************************
    public void mouseClicked(MouseEvent e) 
    {

    }
    public void mousePressed(MouseEvent e) 
    {
 
    	addMouseMotionListener(this);
        int x = e.getX();
        int y = e.getY();
        pick = null;
        for (int i = neuron.nnodes - 1 ; i >= 0 ; i--) 
        {
        	Neuron.Node n = neuron.nodes[i];
        	if ((x > (n.x - n.w / 2)) && (x < (n.x + n.w / 2)) &&
        		(y > (n.y - n.h / 2)) && (y < (n.y + n.h / 2))) 
        	{
        		pick = n;
        		e.consume();
       			break;
        	}
        }	 
        if (pick == null) return;
        
//	CLONE     
        if (x > pick.x + pick.w/2 - d_Box && 
        	x < pick.x + pick.w/2 &&
        	y > pick.y + pick.h/2 - d_Box &&
        	y < pick.y + pick.h/2)
        {
        	pick.clone_Me();
   			repaint();
   			e.consume();
   			return;
        }
            
//	LINK      
        if (x > pick.x - pick.w/2 && 
            x < pick.x - pick.w/2 + d_Box &&
            y > pick.y + pick.h/2 - d_Box &&
            y < pick.y + pick.h/2)
        {
            for (int i = 0 ; i < neuron.nnodes ; i++) 
            {
            	Neuron.Node n = neuron.nodes[i];
            	if (n.S != null ) 
            	{
            		neuron.addNerve(pick.id, n.id, neuron.length, neuron.W); 
 //          		n.s = 0;
            	}
            }

    		repaint();
    		e.consume();
    		return;
        }
 
//	EXCITE       
        if (x > pick.x - pick.w/2 && 
            x < pick.x - pick.w/2 + d_Box &&
            y > pick.y - pick.h/2 &&
            y < pick.y - pick.h/2 + d_Box)
        {
    		pick.excite_Me(1.0);
    		repaint();
    		e.consume();
    		return;
        }
        
//    	SELECTED  

        if (x > pick.x + pick.w/2 - d_Box && 
            x < pick.x + pick.w/2 &&
            y > pick.y - pick.h/2 &&
            y < pick.y - pick.h/2 + d_Box)
        {
        	pick.select_Me();
    		repaint();
    		e.consume();
    		return;
        }    
		repaint();
		e.consume();
    }
    public void mouseReleased(MouseEvent e) 
    {
        removeMouseMotionListener(this);
        if (pick != null) 
        {
        	pick.fixed = !pick.fixed;
            pick = null;
            
        }
        repaint();
        e.consume();
    }
    public void mouseEntered(MouseEvent e) 
    {
    }
    public void mouseExited(MouseEvent e) 
    {
    }
    public void mouseDragged(MouseEvent e) 
    {
        if (pick != null) 
        {
        	pick.x = e.getX();
        	pick.y = e.getY();
        	repaint();
        	e.consume();
        }
    }
    public void mouseMoved(MouseEvent e)
    {
    }
 
    public void run() 
    {
    	Thread me = Thread.currentThread();
    	while (relaxer == me) 
    	{
    		relax();
    		for (int i = 0 ; i < neuron.nnodes ; i++) 
        	{
    			neuron.nodes[i].discharge_Me();
        	}
        	repaint();
    		if (random && (Math.random() < 0.03)) 
    		{
    			Neuron.Node n = neuron.nodes[(int)(Math.random() * neuron.nnodes)];
    			
    			if (!n.fixed) 
    			{
    				n.x += 100*Math.random() - 50;
    				n.y += 100*Math.random() - 50;
    			}
    		}
    		try 
			{
    			Thread.sleep(Sleep_Time);
			} catch (InterruptedException e) 
			{
				break;
			}
    	}
    }
    public void start() 
    {
    	relaxer = new Thread(this);
    	relaxer.start();
        repaint();
    }
    public void stop() 
    {
    	relaxer = null;
    }
}
